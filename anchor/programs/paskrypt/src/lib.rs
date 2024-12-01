#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("AsjZ3kWAUSQRNt2pZVeJkywhZ6gpLpHZmJjduPmKZDZZ");

#[program]
pub mod paskrypt {
    use super::*;

  pub fn close(_ctx: Context<ClosePaskrypt>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.paskrypt.count = ctx.accounts.paskrypt.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.paskrypt.count = ctx.accounts.paskrypt.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializePaskrypt>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.paskrypt.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializePaskrypt<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Paskrypt::INIT_SPACE,
  payer = payer
  )]
  pub paskrypt: Account<'info, Paskrypt>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct ClosePaskrypt<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub paskrypt: Account<'info, Paskrypt>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub paskrypt: Account<'info, Paskrypt>,
}

#[account]
#[derive(InitSpace)]
pub struct Paskrypt {
  count: u8,
}
