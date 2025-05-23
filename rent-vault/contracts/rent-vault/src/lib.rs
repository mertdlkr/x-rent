#![no_std]
use soroban_sdk::{
    contract, contractimpl, contracttype, token, Address, Env, Symbol, Vec,
    symbol_short
};

// Error codes
#[contracttype]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    NotInitialized = 1,
    AlreadyInitialized = 2,
    UnauthorizedAccess = 3,
    InvalidAmount = 4,
    InsufficientBalance = 5,
    RentalNotFound = 6,
    RentalExpired = 7,
    RentalActive = 8,
    InvalidDuration = 9,
    InsufficientCollateral = 10,
    UnauthorizedReturn = 11,
}

// Data structures
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct RentalAgreement {
    pub rental_id: u64,
    pub lender: Address,
    pub borrower: Address,
    pub token_address: Address,
    pub amount: i128,
    pub collateral_amount: i128,
    pub rental_fee: i128,
    pub start_time: u64,
    pub end_time: u64,
    pub is_active: bool,
    pub is_completed: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct TokenListing {
    pub listing_id: u64,
    pub lender: Address,
    pub token_address: Address,
    pub amount: i128,
    pub rental_rate: i128, // Fee percentage per day (basis points)
    pub min_duration: u64, // Minimum rental duration in days
    pub max_duration: u64, // Maximum rental duration in days
    pub collateral_rate: i128, // Collateral percentage required (basis points)
    pub is_available: bool,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct PlatformConfig {
    pub admin: Address,
    pub platform_fee_rate: i128, // Platform fee percentage (basis points)
    pub min_collateral_rate: i128, // Minimum collateral percentage (basis points)
    pub max_rental_duration: u64, // Maximum rental duration in days
}

// Storage keys
const NEXT_RENTAL_ID: Symbol = symbol_short!("rent_id");
const NEXT_LISTING_ID: Symbol = symbol_short!("list_id");
const CONFIG: Symbol = symbol_short!("config");
const RENTAL: Symbol = symbol_short!("rental");
const LISTING: Symbol = symbol_short!("listing");
const USER_RENTALS: Symbol = symbol_short!("u_rents");
const USER_LISTINGS: Symbol = symbol_short!("u_lists");

#[contract]
pub struct XRentContract;

#[contractimpl]
impl XRentContract {
    /// Initialize the contract with admin address
    pub fn initialize(env: Env, admin: Address) {
        if env.storage().instance().has(&CONFIG) {
            panic!("Already initialized");
        }

        let config = PlatformConfig {
            admin: admin.clone(),
            platform_fee_rate: 250, // 2.5% platform fee
            min_collateral_rate: 1000, // 10% minimum collateral
            max_rental_duration: 365, // 1 year max rental
        };

        env.storage().instance().set(&CONFIG, &config);
        env.storage().instance().set(&NEXT_RENTAL_ID, &1u64);
        env.storage().instance().set(&NEXT_LISTING_ID, &1u64);

        env.events().publish(
            (symbol_short!("init"),),
            (admin,)
        );
    }

    /// Create a new token listing for rental
    pub fn create_listing(
        env: Env,
        lender: Address,
        token_address: Address,
        amount: i128,
        rental_rate: i128,
        min_duration: u64,
        max_duration: u64,
        collateral_rate: i128,
    ) -> u64 {
        lender.require_auth();

        if amount <= 0 {
            panic!("Invalid amount");
        }

        let config: PlatformConfig = env.storage().instance()
            .get(&CONFIG)
            .unwrap_or_else(|| panic!("Not initialized"));

        if collateral_rate < config.min_collateral_rate {
            panic!("Insufficient collateral");
        }

        if max_duration > config.max_rental_duration {
            panic!("Invalid duration");
        }

        // Transfer tokens to contract for escrow
        let token_client = token::Client::new(&env, &token_address);
        token_client.transfer(&lender, &env.current_contract_address(), &amount);

        let listing_id: u64 = env.storage().instance()
            .get(&NEXT_LISTING_ID)
            .unwrap_or(1);

        let listing = TokenListing {
            listing_id,
            lender: lender.clone(),
            token_address: token_address.clone(),
            amount,
            rental_rate,
            min_duration,
            max_duration,
            collateral_rate,
            is_available: true,
        };

        env.storage().persistent().set(&(LISTING, listing_id), &listing);
        env.storage().instance().set(&NEXT_LISTING_ID, &(listing_id + 1));

        // Update user listings
        let mut user_listings: Vec<u64> = env.storage().persistent()
            .get(&(USER_LISTINGS, &lender))
            .unwrap_or(Vec::new(&env));
        user_listings.push_back(listing_id);
        env.storage().persistent().set(&(USER_LISTINGS, &lender), &user_listings);

        env.events().publish(
            (symbol_short!("list_tok"), listing_id),
            (lender, token_address, amount, rental_rate)
        );

        listing_id
    }

    /// Rent tokens from a listing
    pub fn rent_tokens(
        env: Env,
        borrower: Address,
        listing_id: u64,
        duration: u64, // Duration in days
    ) -> u64 {
        borrower.require_auth();

        let mut listing: TokenListing = env.storage().persistent()
            .get(&(LISTING, listing_id))
            .unwrap_or_else(|| panic!("Rental not found"));

        if !listing.is_available {
            panic!("Rental not available");
        }

        if duration < listing.min_duration || duration > listing.max_duration {
            panic!("Invalid duration");
        }

        let config: PlatformConfig = env.storage().instance()
            .get(&CONFIG)
            .unwrap_or_else(|| panic!("Not initialized"));

        // Calculate fees and collateral
        let rental_fee = (listing.amount * listing.rental_rate * duration as i128) / 10000;
        let platform_fee = (rental_fee * config.platform_fee_rate) / 10000;
        let total_fee = rental_fee + platform_fee;
        let collateral_amount = (listing.amount * listing.collateral_rate) / 10000;

        // Transfer rental fee and collateral from borrower
        let token_client = token::Client::new(&env, &listing.token_address);
        token_client.transfer(&borrower, &env.current_contract_address(), &(total_fee + collateral_amount));

        // Transfer rental fee to lender (minus platform fee)
        token_client.transfer(&env.current_contract_address(), &listing.lender, &rental_fee);

        // Transfer tokens to borrower
        token_client.transfer(&env.current_contract_address(), &borrower, &listing.amount);

        let rental_id: u64 = env.storage().instance()
            .get(&NEXT_RENTAL_ID)
            .unwrap_or(1);

        let current_time = env.ledger().timestamp();
        let end_time = current_time + (duration * 24 * 60 * 60); // Convert days to seconds

        let rental = RentalAgreement {
            rental_id,
            lender: listing.lender.clone(),
            borrower: borrower.clone(),
            token_address: listing.token_address.clone(),
            amount: listing.amount,
            collateral_amount,
            rental_fee,
            start_time: current_time,
            end_time,
            is_active: true,
            is_completed: false,
        };

        env.storage().persistent().set(&(RENTAL, rental_id), &rental);
        env.storage().instance().set(&NEXT_RENTAL_ID, &(rental_id + 1));

        // Update user rentals
        let mut user_rentals: Vec<u64> = env.storage().persistent()
            .get(&(USER_RENTALS, &borrower))
            .unwrap_or(Vec::new(&env));
        user_rentals.push_back(rental_id);
        env.storage().persistent().set(&(USER_RENTALS, &borrower), &user_rentals);

        // Mark listing as unavailable
        listing.is_available = false;
        env.storage().persistent().set(&(LISTING, listing_id), &listing);

        env.events().publish(
            (symbol_short!("rent_tok"), rental_id),
            (borrower, listing.lender, listing.amount, duration)
        );

        rental_id
    }

    /// Return rented tokens
    pub fn return_tokens(env: Env, borrower: Address, rental_id: u64) {
        borrower.require_auth();

        let mut rental: RentalAgreement = env.storage().persistent()
            .get(&(RENTAL, rental_id))
            .unwrap_or_else(|| panic!("Rental not found"));

        if rental.borrower != borrower {
            panic!("Unauthorized return");
        }

        if !rental.is_active {
            panic!("Rental expired");
        }

        let current_time = env.ledger().timestamp();
        let token_client = token::Client::new(&env, &rental.token_address);

        // Transfer tokens back from borrower to lender
        token_client.transfer(&borrower, &rental.lender, &rental.amount);

        // Return collateral to borrower
        if current_time <= rental.end_time {
            // On-time return: full collateral back
            token_client.transfer(&env.current_contract_address(), &borrower, &rental.collateral_amount);
        } else {
            // Late return: partial collateral forfeit
            let late_penalty_rate = 1000; // 10% penalty
            let penalty = (rental.collateral_amount * late_penalty_rate) / 10000;
            let refund = rental.collateral_amount - penalty;
            
            if refund > 0 {
                token_client.transfer(&env.current_contract_address(), &borrower, &refund);
            }
            
            // Send penalty to lender as compensation
            if penalty > 0 {
                token_client.transfer(&env.current_contract_address(), &rental.lender, &penalty);
            }
        }

        // Mark rental as completed
        rental.is_active = false;
        rental.is_completed = true;
        env.storage().persistent().set(&(RENTAL, rental_id), &rental);

        env.events().publish(
            (symbol_short!("ret_tok"), rental_id),
            (borrower, rental.lender, current_time <= rental.end_time)
        );
    }

    /// Emergency return by lender (after expiry)
    pub fn emergency_return(env: Env, lender: Address, rental_id: u64) {
        lender.require_auth();

        let mut rental: RentalAgreement = env.storage().persistent()
            .get(&(RENTAL, rental_id))
            .unwrap_or_else(|| panic!("Rental not found"));

        if rental.lender != lender {
            panic!("Unauthorized access");
        }

        if !rental.is_active {
            panic!("Rental expired");
        }

        let current_time = env.ledger().timestamp();
        if current_time <= rental.end_time {
            panic!("Rental still active");
        }

        let token_client = token::Client::new(&env, &rental.token_address);

        // Force return tokens from borrower to lender
        token_client.transfer(&rental.borrower, &rental.lender, &rental.amount);

        // Forfeit entire collateral to lender
        token_client.transfer(&env.current_contract_address(), &rental.lender, &rental.collateral_amount);

        // Mark rental as completed
        rental.is_active = false;
        rental.is_completed = true;
        env.storage().persistent().set(&(RENTAL, rental_id), &rental);

        env.events().publish(
            (symbol_short!("emg_ret"), rental_id),
            (lender, rental.borrower)
        );
    }

    /// Get rental agreement details
    pub fn get_rental(env: Env, rental_id: u64) -> Option<RentalAgreement> {
        env.storage().persistent().get(&(RENTAL, rental_id))
    }

    /// Get token listing details
    pub fn get_listing(env: Env, listing_id: u64) -> Option<TokenListing> {
        env.storage().persistent().get(&(LISTING, listing_id))
    }

    /// Get user's rental history
    pub fn get_user_rentals(env: Env, user: Address) -> Vec<u64> {
        env.storage().persistent()
            .get(&(USER_RENTALS, &user))
            .unwrap_or(Vec::new(&env))
    }

    /// Get user's listings
    pub fn get_user_listings(env: Env, user: Address) -> Vec<u64> {
        env.storage().persistent()
            .get(&(USER_LISTINGS, &user))
            .unwrap_or(Vec::new(&env))
    }

    /// Get platform configuration
    pub fn get_config(env: Env) -> Option<PlatformConfig> {
        env.storage().instance().get(&CONFIG)
    }

    /// Cancel a listing (only by lender)
    pub fn cancel_listing(env: Env, lender: Address, listing_id: u64) {
        lender.require_auth();

        let mut listing: TokenListing = env.storage().persistent()
            .get(&(LISTING, listing_id))
            .unwrap_or_else(|| panic!("Rental not found"));

        if listing.lender != lender {
            panic!("Unauthorized access");
        }

        if !listing.is_available {
            panic!("Listing not available");
        }

        // Return tokens to lender
        let token_client = token::Client::new(&env, &listing.token_address);
        token_client.transfer(&env.current_contract_address(), &lender, &listing.amount);

        // Mark listing as unavailable
        listing.is_available = false;
        env.storage().persistent().set(&(LISTING, listing_id), &listing);

        env.events().publish(
            (symbol_short!("can_list"), listing_id),
            (lender,)
        );
    }
}

mod test;
