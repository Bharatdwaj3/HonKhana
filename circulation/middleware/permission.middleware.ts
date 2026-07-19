import PERMISSIONS from '../config/permissions.config.ts';
import express from 'express';

type Request = express.Request;
type Response = express.Response;
type NextFunction = express.NextFunction;

const checkPermission=(permission: any)=>{
    return (req:Request, res:Response, next:NextFunction)=>{
        const userRole = req.role || req.user?.accountType || 'guest';
        const allowed = PERMISSIONS[userRole] || [];
        if(!allowed.includes(permission)){
            return res.status(403).json({message: 'Access denied insuffient permissions'});
        }
        next();
    };
};

export default checkPermission;