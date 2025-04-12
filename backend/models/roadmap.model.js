import mongoose from "mongoose";
import { Schema } from "mongoose";

const roadmapSchema = new Schema({
    domain: {
        type: String,
        required: true
    },
    levels: [
        {
            level_type: {
                type: String,
                required: true,
                enum: ["Basic", "Intermediate", "Advanced"]
            },
            ref_resources: {
                ref_videos: {
                    type: [String],
                    required: true
                },
                ref_articles: {
                    type: [String],
                    required: true
                }
            }
        }
    ]
}, { timestamps: true });

export const Roadmap = mongoose.model("Roadmap", roadmapSchema);
