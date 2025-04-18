import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";
export const getAdmins = async (req, res) => {
    try {
        const admins = await User.find({role:"admin"}).select("-password");

        if(!admins) return res.status(400).json({message: "No admins found"});
        res.status(200).json(admins);
    } catch (error) {
        res.status(500).json({message: error.message || "Error fetching admins"});
    }
};


export const getUserPerformance = async(req, res) => {
    try {
        const {id} = req.params;

        const userWithStats = await User.aggregate([
            {$match:{_id: new mongoose.Types.ObjectId(id)}},
            {$lookup: {
                from: "affiliatestats",
                localField: "_id",
                foreignField:"userId",
                as: "affiliateStats",

            }},
            {$unwind: "$affiliateStats"},
        ]);
        const salesTransactions = await Promise.all(
            userWithStats[0].affiliateStats.affiliateSales.map((id) =>{
                return Transaction.findById(id);
            })
        )
        const filteredSalesTransactions = salesTransactions.filter(
            (transaction) => transaction !== null
        )
        res.status(200).json({
            user: userWithStats[0],
            sales: filteredSalesTransactions,
        })
    } catch (error) {
        res.status(500).json({message:error.message || "Error Fetching User Performance"});
    }
};