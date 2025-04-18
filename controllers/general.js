import User from "../models/User.js"
import Transaction from "../models/Transaction.js"
import OverallStat from "../models/OverallStat.js"

export const getUser = async(req, res) => {
    try {
        const {id} = req.params;
        const user = await User.findById(id);

        if(!user) return res.status(404).json({message:"User not Found"});

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
}

export const getDashboardStats = async(req, res) => {
    try{
        // hardcoded values
        const currentMonth = "November";
        const currentYear = 2021;
        const currentDay = "2021-11-15";
        // recent transactions
        const transactions = await Transaction.find().limit(50).sort({createdOn: -1});

        // overall stats
        const overallStats = await OverallStat.find({year:currentYear});
        const {
            totalCustomers,
            yearlyTotalSoldUnits,
            yearlySalesTotal, 
            monthlyData, 
            salesByCategory} = 
        overallStats[0];

        const thisMonthStats = overallStats[0].monthlyData.find(({month}) =>{
            return month === currentMonth;
        });

        const dailyStats = overallStats[0].dailyData.find(({date}) =>{
            return date === currentDay;
        });

        res.status(200).json({
            totalCustomers,
            yearlyTotalSoldUnits,
            yearlySalesTotal,
            monthlyData,
            salesByCategory,
            thisMonthStats,
            dailyStats,
            transactions
        });
    }catch(error){
        res.status(500).json({message:error.message});
    }
}
