#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("8R5t4StGwtvamNBx8PsMGnPYGT6Q9CRwRtSDLjBRTK15");

#[program]
pub mod paskrypt {
    use super::*;

    pub fn create_password_entry(ctx: Context<CreatePasswordEntry>, username: String, password: String) -> Result<()> {
      let password_entry = &mut ctx.accounts.password_entry;
      password_entry.owner = *ctx.accounts.owner.key;
      password_entry.username = username;
      password_entry.password = password;

      Ok(())
    }

    pub fn update_password_entry(ctx: Context<UpdatePasswordEntry>, _username: String, password: String) -> Result<()> {
      let password_entry = &mut ctx.accounts.password_entry;
      password_entry.password = password;

      Ok(())
    }

    pub fn delete_password_entry(_ctx: Context<DeletePasswordEntry>, _username: String) -> Result<()> {
      Ok(())
    }
}

#[derive(Accounts)]
#[instruction(username: String)]
pub struct CreatePasswordEntry<'info> {
  #[account(
    init,
    seeds = [username.as_bytes(), owner.key().as_ref()],
    bump,
    payer = owner,
    space = 8 + PasswordEntryState::INIT_SPACE
  )]
  pub password_entry: Account<'info, PasswordEntryState>,
  #[account(mut)]
  pub owner: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(username: String)]
pub struct UpdatePasswordEntry<'info> {
  #[account(
    mut,
    seeds = [username.as_bytes(), owner.key().as_ref()],
    bump,
    realloc = 8 + PasswordEntryState::INIT_SPACE,
    realloc::payer = owner, 
    realloc::zero = true, 
  )]
  pub password_entry: Account<'info, PasswordEntryState>,
  #[account(mut)]
  pub owner: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(username: String)]
pub struct DeletePasswordEntry<'info> {
  #[account(
    mut,
    seeds = [username.as_bytes(), owner.key().as_ref()],
    bump,
    close = owner,
  )]
  pub password_entry: Account<'info, PasswordEntryState>,
  #[account(mut)]
  pub owner: Signer<'info>,
  pub system_program: Program<'info, System>,
}

#[account]
#[derive(InitSpace)]
pub struct PasswordEntryState {
  pub owner: Pubkey,
  #[max_len(64)]
  pub username: String,
  #[max_len(64)]
  pub password: String,
}