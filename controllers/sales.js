import OverallStat from "../models/OverallStat.js"

export const getOverview = async(req, res) => {
    try {
        const overallStats = await OverallStat.find();
        
        if(!overallStats || overallStats.length === 0) {
            return res.status(404).json({message:"No Overview Data Found"});
        }

        res.status(200).json(overallStats[0]);
    } catch (error) {
        res.status(500).json({message:error.message || "Internal server error"});
    }
}
