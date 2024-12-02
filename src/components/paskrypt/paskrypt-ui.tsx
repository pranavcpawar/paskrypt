"use client";

import { PublicKey } from "@solana/web3.js";
import { useRef, useState } from "react";
import { IconEyeOff, IconEye } from "@tabler/icons-react";
import {
	usePaskryptProgram,
	usePaskryptProgramAccount,
} from "./paskrypt-data-access";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "./types";
import { userSchema } from "./schema";
import { useWallet } from "@solana/wallet-adapter-react";
import toast from "react-hot-toast";
import * as cryptoBrowserify from "crypto-browserify";

export function AddPasswordForm() {
	const {
		register,
		handleSubmit,
		formState: { isSubmitting, errors },
	} = useForm<User>({
		defaultValues: {
			username: "",
			password: "",
		},
		resolver: zodResolver(userSchema),
	});

	const { createPasswordEntry } = usePaskryptProgram();
	const { publicKey, signMessage } = useWallet();

	const onSubmit: SubmitHandler<User> = async(data: User) => {
		if (!publicKey || !signMessage) {
			toast.error("Wallet not connected!");
			return;
		}

		const key = crypto.getRandomValues(new Uint8Array(32));
		const salt = crypto.getRandomValues(new Uint8Array(16));

		const cipher = cryptoBrowserify.createCipheriv('aes-256-gcm', key, salt);
		let encrypted = cipher.update(data.password, 'utf8', 'hex');
		encrypted += cipher.final('hex');

		const signature = Buffer.from(await signMessage(new TextEncoder().encode(encrypted))).toString('base64');

		console.log(signature.slice(0, 63));

		createPasswordEntry.mutate({
			username: data.username,
			password: signature.slice(0, 63),
			owner: publicKey,
		});
	};



	const ref = useRef<HTMLFormElement>(null);
	return (
		<form
			ref={ref}
			onSubmit={handleSubmit(onSubmit)}
			className="flex w-3/4 flex-col gap-3 items-center border-2 border-[#252525] p-4 rounded-[12px]"
		>
			<h3 className="text-xl font-semibold font-parkinsans mb-4">
				Add Password
			</h3>
			<div className="flex w-full flex-col gap-1">
				<input
					type="text"
					{...register("username")}
					className="rounded-md border border-[#252525] bg-black p-2 font-parkinsans text-base text-[#f8f8f8] outline-none placeholder:text-[#6b6b6b]"
					placeholder="username"
				/>
				{errors.username ? (
					<span className="block h-4 text-xs text-red-500">
						<span className="mr-1" />
						{errors.username.message}
					</span>
				) : (
					<span className="block h-4 flex-shrink-0" />
				)}
				<input
					type="password"
					{...register("password")}
					className="rounded-md border border-[#252525] bg-black p-2 font-parkinsans text-base text-[#f8f8f8] outline-none placeholder:text-[#6b6b6b]"
					placeholder="password"
				/>
				{errors.password ? (
					<span className="block h-4 text-xs text-red-500">
						<span className="mr-1" />
						{errors.password.message}
					</span>
				) : (
					<span className="block h-4 flex-shrink-0" />
				)}
			</div>
			<button
				type="submit"
				disabled={isSubmitting || createPasswordEntry.isPending}
				className="rounded-md bg-[#0A67C2] w-full px-2 py-1 text-lg font-medium text-[#dadada] hover:bg-[#0A67C2]/80 active:scale-95"
			>
				Add
			</button>
		</form>
	);
}

export function PasswordList() {
	const { accounts, getProgramAccount } = usePaskryptProgram();

	if (getProgramAccount.isLoading) {
		return <span className="loading loading-spinner loading-lg"></span>;
	}
	if (!getProgramAccount.data?.value) {
		return (
			<div className="alert alert-info flex justify-center">
				<span>
					Program account not found. Make sure you have deployed the program and
					are on the correct cluster.
				</span>
			</div>
		);
	}
	return (
		<div
			className={
				"space-y-6 border-2 border-[#252525] p-4 rounded-[12px] w-3/4 h-full"
			}
		>
			{accounts.isLoading ? (
				<span className="loading loading-spinner loading-lg"></span>
			) : accounts.data?.length ? (
				<div className="grid gap-2 w-full">
					{accounts.data?.map((account) => (
						<PaskryptCard
							key={account.publicKey.toString()}
							account={account.publicKey}
						/>
					))}
				</div>
			) : (
				<div className="text-center">
					<h2 className={"text-2xl"}>No accounts</h2>
					No accounts found. Create one above to get started.
				</div>
			)}
		</div>
	);
}

function PaskryptCard({ account }: { account: PublicKey }) {
	const {
		accountQuery,
		updateEntry,
		deleteEntry
	} = usePaskryptProgramAccount({
		account,
	});

	const { publicKey, signMessage } = useWallet();
	const [isEncrypted, setIsEncrypted] = useState(false);

	const username = accountQuery.data?.username;

	async function handleEncryption() {
		
		if (isEncrypted) {
			setIsEncrypted(!isEncrypted);
			return;
		}
		
		if (!publicKey || !signMessage) {
			return;
		}
		try {
			const encoder = new TextEncoder();
			const message = "Encryption!";
			const messageBuffer = encoder.encode(message);
			await signMessage(messageBuffer);
			setIsEncrypted(!isEncrypted);
		} catch (error: any) {
			toast.error('Failed to sign message:', error.message)
		}
	}

	return accountQuery.isLoading ? (
		<span className="loading loading-spinner loading-lg"></span>
	) : (
		<div className="p-2 rounded-md w-full border-2 border-[#252525] flex items-center justify-between h-10">
			<h3 className="text-sm font-normal font-parkinsans w-1/2">{username}</h3>
			<h3 className="w-1/2 flex items-center">
				{!isEncrypted ? <span className="text-sm font-normal pt-1">* * * * *</span> : <span className="text-sm font-normal font-parkinsans">{accountQuery.data?.password}</span>}
			</h3>
			<div onClick={handleEncryption}>
				{!isEncrypted ? <IconEye  size={20}/> : <IconEyeOff size={20}/>}
			</div>
		</div>
	);
}
