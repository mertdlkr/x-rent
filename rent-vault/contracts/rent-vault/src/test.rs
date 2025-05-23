#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::Address as _, Address, Env};

#[test]
fn test_initialize_contract() {
    let env = Env::default();
    let contract_id = env.register(XRentContract, ());
    let client = XRentContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);

    let config = client.get_config().unwrap();
    assert_eq!(config.admin, admin);
    assert_eq!(config.platform_fee_rate, 250);
    assert_eq!(config.min_collateral_rate, 1000);
    assert_eq!(config.max_rental_duration, 365);
}

#[test]
fn test_create_listing() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(XRentContract, ());
    let client = XRentContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let lender = Address::generate(&env);
    
    // Initialize contract
    client.initialize(&admin);

    // Create a mock token
    let token_admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract_v2(token_admin.clone());
    let token_id = token_contract.address();
    let token_client = token::StellarAssetClient::new(&env, &token_id);
    
    // Mint tokens to lender
    token_client.mint(&lender, &1000);

    // Create listing
    let listing_id = client.create_listing(
        &lender,
        &token_id,
        &100,  // amount
        &500,  // rental rate (5% per day)
        &1,    // min duration
        &30,   // max duration
        &1500  // collateral rate (15%)
    );

    assert_eq!(listing_id, 1);

    let listing = client.get_listing(&listing_id).unwrap();
    assert_eq!(listing.lender, lender);
    assert_eq!(listing.amount, 100);
    assert_eq!(listing.rental_rate, 500);
    assert!(listing.is_available);

    // Check user listings
    let user_listings = client.get_user_listings(&lender);
    assert_eq!(user_listings.len(), 1);
    assert_eq!(user_listings.get(0).unwrap(), listing_id);
}

#[test]
fn test_rent_tokens() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(XRentContract, ());
    let client = XRentContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let lender = Address::generate(&env);
    let borrower = Address::generate(&env);
    
    // Initialize contract
    client.initialize(&admin);

    // Create a mock token
    let token_admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract_v2(token_admin.clone());
    let token_id = token_contract.address();
    let token_client = token::StellarAssetClient::new(&env, &token_id);
    
    // Mint tokens
    token_client.mint(&lender, &1000);
    token_client.mint(&borrower, &1000);

    // Create listing
    let listing_id = client.create_listing(
        &lender,
        &token_id,
        &100,  // amount
        &500,  // rental rate (5% per day)
        &1,    // min duration
        &30,   // max duration
        &1500  // collateral rate (15%)
    );

    // Rent tokens
    let rental_id = client.rent_tokens(
        &borrower,
        &listing_id,
        &7  // 7 days
    );

    assert_eq!(rental_id, 1);

    let rental = client.get_rental(&rental_id).unwrap();
    assert_eq!(rental.borrower, borrower);
    assert_eq!(rental.lender, lender);
    assert_eq!(rental.amount, 100);
    assert!(rental.is_active);
    assert!(!rental.is_completed);

    // Check that listing is no longer available
    let listing = client.get_listing(&listing_id).unwrap();
    assert!(!listing.is_available);

    // Check user rentals
    let user_rentals = client.get_user_rentals(&borrower);
    assert_eq!(user_rentals.len(), 1);
    assert_eq!(user_rentals.get(0).unwrap(), rental_id);
}

#[test]
fn test_return_tokens() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(XRentContract, ());
    let client = XRentContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let lender = Address::generate(&env);
    let borrower = Address::generate(&env);
    
    // Initialize contract
    client.initialize(&admin);

    // Create a mock token
    let token_admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract_v2(token_admin.clone());
    let token_id = token_contract.address();
    let token_client = token::StellarAssetClient::new(&env, &token_id);
    
    // Mint tokens
    token_client.mint(&lender, &1000);
    token_client.mint(&borrower, &1000);

    // Create listing and rent tokens
    let listing_id = client.create_listing(
        &lender, &token_id, &100, &500, &1, &30, &1500
    );
    
    let rental_id = client.rent_tokens(&borrower, &listing_id, &7);

    // Return tokens
    client.return_tokens(&borrower, &rental_id);

    let rental = client.get_rental(&rental_id).unwrap();
    assert!(!rental.is_active);
    assert!(rental.is_completed);
}

#[test]
fn test_cancel_listing() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(XRentContract, ());
    let client = XRentContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let lender = Address::generate(&env);
    
    // Initialize contract
    client.initialize(&admin);

    // Create a mock token
    let token_admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract_v2(token_admin.clone());
    let token_id = token_contract.address();
    let token_client = token::StellarAssetClient::new(&env, &token_id);
    
    // Mint tokens to lender
    token_client.mint(&lender, &1000);

    // Create listing
    let listing_id = client.create_listing(
        &lender, &token_id, &100, &500, &1, &30, &1500
    );

    // Cancel listing
    client.cancel_listing(&lender, &listing_id);

    let listing = client.get_listing(&listing_id).unwrap();
    assert!(!listing.is_available);
}

#[test]
#[should_panic(expected = "Already initialized")]
fn test_double_initialization() {
    let env = Env::default();
    let contract_id = env.register(XRentContract, ());
    let client = XRentContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    client.initialize(&admin);
    
    // This should panic
    client.initialize(&admin);
}

#[test]
#[should_panic(expected = "Invalid amount")]
fn test_invalid_amount() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(XRentContract, ());
    let client = XRentContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let lender = Address::generate(&env);
    
    client.initialize(&admin);

    let token_admin = Address::generate(&env);
    let token_contract = env.register_stellar_asset_contract_v2(token_admin.clone());
    let token_id = token_contract.address();

    // This should panic due to invalid amount (0)
    client.create_listing(&lender, &token_id, &0, &500, &1, &30, &1500);
}
