import mongoose, {Schema, Document} from "mongoose";

enum taskTypeEnum {
  kill = "kill",
  collect = "collect",
  openChest = "openChest",
  openDoor = "openDoor",
  TalkToNPC = "TalkToNPC",
}

export interface Quest extends Document {
  name: string;
  description: string;
  tasks: {
    description: string;
    taskType: taskTypeEnum;
    tragetId: Schema.Types.ObjectId | null | string;
    taskReward: {
      RewardId: Schema.Types.ObjectId | null | string
      RewardModelName: string
    }[];
    completed: boolean;
  }[]
  reward: {
    gold: number | null;
    experience: number | null ;
    items: Schema.Types.ObjectId[] | null;
  };
  createdAt: Date;
  updatedAt: Date;
  // previous thing needs to do before completed to unlock this quest
  previous:{
    quest: Schema.Types.ObjectId[] | null
    [key: string]: any
  },
  [key: string]: any
}

const questSchema = new Schema<Quest>({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  tasks: [
    {
      description: {
        type: String,
        required: true
      },
      taskType: {
        type: String,
        required: true,
        enum: Object.values(taskTypeEnum)
      },
      taskReward: {
        type:[
          {
            RewardId: {
              type: Schema.Types.ObjectId,
              refPath: "tasks.taskReward.RewardModelName",
              required: false,
            },
            RewardModelName: {
              type: String,
              required: true,
              enum: ["Item", "Armor", "Weapon"]
            }
          }
        ]
      },
      completed: {
        type: Boolean,
        required: true,
        default: false
      }
    }
  ],
  reward: {
    gold: {
      type: Number,
      required: false,
      default: null
    },
    experience: {
      type: Number,
      required: false,
      default: null
    },
    items: {
      type: [Schema.Types.ObjectId],
      required: false,
      default: null
    }
  },
  previous: {
    quest: {
      type: [Schema.Types.ObjectId],
      required: false,
      default: null
    }
  },
},{timestamps: true});

export default mongoose.model<Quest>("Quest", questSchema);
