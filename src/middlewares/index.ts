import express from "express";
import { get, identity, merge } from "lodash";

import { getUserBySessionToken } from "../db/user";

export const isAuthenticated = async (
	req: express.Request,
	res: express.Response,
	next: express.NextFunction
) => {
	try {
		const sessionToken = res.cookies["REST-API-AUTH"];

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
