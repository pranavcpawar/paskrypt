"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletButton } from "../solana/solana-provider";
import { ellipsify } from "../ui/ui-layout";
import { ExplorerLink } from "../cluster/cluster-ui";
import { usePaskryptProgram } from "./paskrypt-data-access";
import { AddPasswordForm, PasswordList } from "./paskrypt-ui";

export default function PaskryptFeature() {
	const { publicKey } = useWallet();
	const { programId } = usePaskryptProgram();

	return publicKey ? (
		<div className="p-2 rounded-md w-full h-full mx-auto flex items-center flex-col justify-start gap-4">
			<div className="w-3/4 p-2 items-center justify-end flex">
				<ExplorerLink
					path={`account/${programId}`}
					label={ellipsify(programId.toString())}
				/>
			</div>
			<AddPasswordForm />
			<PasswordList />
		</div>
	) : (
		<div className="max-w-4xl mx-auto">
			<div className="hero py-[64px]">
				<div className="hero-content text-center">
					<WalletButton />
				</div>
			</div>
		</div>
	);
}
