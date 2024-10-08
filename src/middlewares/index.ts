import express from "express";
import { get, identity, merge } from "lodash";

import { getUserBySessionToken } from "../db/user";

export const isOwner = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	try {
		const { id } = req.params;
		const currentUserId = get(req, "identity._id") as string;

		if (!currentUserId) {
			return res.sendStatus(403);
		}

		if (currentUserId.toString() !== id) {
			return res.sendStatus(403);
		}

		next();
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
};

export const isAuthenticated = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	try {
		const sessionToken = req.cookies["REST-API-AUTH"];

		if (!sessionToken) {
			return res.sendStatus(403);
		}

		const exsistingUser = await getUserBySessionToken(sessionToken);

		if (!exsistingUser) {
			return res.sendStatus(400);
		}

		merge(req, { identity: exsistingUser });
		return next();
	} catch (error) {
		console.log(error);
		return res.sendStatus(400);
	}
};
