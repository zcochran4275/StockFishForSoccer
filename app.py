from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from pydantic import BaseModel
import xgboost as xgb
import numpy as np
from sklearn.pipeline import make_pipeline
from typing import List, Union
import pandas as pd

import joblib
class MultiStageModel:
    def __init__(self, parameters):
        self.parameters = parameters or {}
        self.model1 = xgb.XGBClassifier(use_label_encoder=False, **self.parameters)
        self.model2 = xgb.XGBClassifier(use_label_encoder=False, **self.parameters)

    def fit(self, X, y1, y2):
        self.model1.fit(X, y1)
        X_stage2 = X[y1 == 1]
        self.model2.fit(X_stage2, y2[y1 == 1])

    def predict_proba(self, X):
        p1 = self.model1.predict_proba(X)[:, 1]
        p2 = self.model2.predict_proba(X)[:, 1]
        return p1 * p2
    def save(self, path_prefix):
        joblib.dump(self.model1, f"{path_prefix}_model1.pkl")
        joblib.dump(self.model2, f"{path_prefix}_model2.pkl")
        joblib.dump(self.parameters, f"{path_prefix}_params.pkl")

    @classmethod
    def load(cls, path_prefix):
        parameters = joblib.load(f"{path_prefix}_params.pkl")
        instance = cls(parameters)
        instance.model1 = joblib.load(f"{path_prefix}_model1.pkl")
        instance.model2 = joblib.load(f"{path_prefix}_model2.pkl")
        return instance

class websiteInputPreprocessor(BaseEstimator, TransformerMixin):
    def fit(self, X, y=None):
        return self
        
    def transform(self, X):
        # Initialize array to store features
        features = []
        
        # Process each pass (every 5 elements in input list)
        for i in range(0, 35, 7):
            try:
                start_loc = X[i:i+2]
                end_loc = X[i+2:i+4]
                outcome = X[i+4]
                
                # Calculate pass features
                pass_angle = np.arctan2(end_loc[1] - start_loc[1], end_loc[0] - start_loc[0])
                pass_length = np.sqrt((end_loc[0] - start_loc[0])**2 + (end_loc[1] - start_loc[1])**2)
                
                # Calculate distances and angles
                start_dist_center = np.abs(start_loc[0] - 40)
                end_dist_center = np.abs(end_loc[0] - 40)
                end_dist_goal = np.sqrt((end_loc[0] - 120)**2 + (end_loc[1] - 40)**2)
                end_angle_goal = np.arctan2(end_loc[1] - 40, end_loc[0] - 120)
                pass_type = X[i+5]
                pass_height = 0 if X[i+6] == "Ground" else 1 if X[i+6] == "Low" else 2
                cross = 1 if pass_type == "Cross" else 0
                throw_in = 1 if pass_type == "Throw-in" else 0
                corner = 1 if pass_type == "Corner" else 0
                free_kick = 1 if pass_type == "Free Kick" else 0
                goal_kick = 1 if pass_type == "Goal Kick" else 0
                cut_back = 1 if pass_type == "Cut-back" else 0
                switch = 1 if pass_type == "Switch" else 0
                through_ball = 1 if pass_type == "Through Ball" else 0

                # Add features in order
                features.extend([
                    outcome,
                    pass_angle,
                    pass_length,
                    cross,
                    cut_back,
                    switch,
                    through_ball,
                    pass_height,
                    start_loc[0],
                    start_loc[1],
                    end_loc[0],
                    end_loc[1],
                    start_dist_center,
                    end_dist_center,
                    end_dist_goal,
                    end_angle_goal,
                    throw_in,
                    corner,
                    free_kick,
                    goal_kick
                ])
            except IndexError:
                features.extend([np.nan] * 20)
        num_passes = np.sum(~np.isnan(np.array(features[::20])))
        # Get coordinates for each pass in sequence
        pass4x2 = features[4*20+10]
        pass4y2 = features[4*20+11]
        pass3x2 = features[3*20+10]
        pass3y2 = features[3*20+11]
        pass2x2 = features[2*20+10]
        pass2y2 = features[2*20+11]
        pass1x2 = features[1*20+10]
        pass1y2 = features[1*20+11]
        pass0x2 = features[0*20+10]
        pass0y2 = features[0*20+11]

        pass0x1 = features[0*20+8]
        pass0y1 = features[0*20+9]
        

        # Find last completed pass end coordinates
        last_pass_x2 = pass4x2
        if pd.isna(last_pass_x2):
            last_pass_x2 = pass3x2
            if pd.isna(last_pass_x2):
                last_pass_x2 = pass2x2
                if pd.isna(last_pass_x2):
                    last_pass_x2 = pass1x2
                    if pd.isna(last_pass_x2):
                        last_pass_x2 = pass0x2

        last_pass_y2 = pass4y2  
        if pd.isna(last_pass_y2):
            last_pass_y2 = pass3y2
            if pd.isna(last_pass_y2):
                last_pass_y2 = pass2y2
                if pd.isna(last_pass_y2):
                    last_pass_y2 = pass1y2
                    if pd.isna(last_pass_y2):
                        last_pass_y2 = pass0y2
        direct_length = np.sqrt((last_pass_x2-pass0x1)**2 + (last_pass_y2-pass0y1)**2)
        total_length = np.nansum(np.array(features[2::20]))
        directness = direct_length/total_length if num_passes > 1 else np.nan
        direct_angle = np.arctan2(last_pass_y2 - pass0y1, last_pass_x2 - pass0x1) if num_passes > 1 else np.nan
        all_successful = np.all(np.isnan(np.array(features[::20])) | (np.array(features[::20]) == 1))
        features.extend([num_passes,direct_length,total_length,directness,direct_angle,all_successful])
        return np.array(features).reshape(1, -1)



model = xgb.XGBClassifier()
model.load_model("final_xgb_modelV3.json")

# model = MultiStageModel.load('msm_model')

websitePipeline = make_pipeline(
    websiteInputPreprocessor(),
    model
)

app = FastAPI()

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*",'http://127.0.0.1:5500','http://localhost:5500','https://zcochran27.github.io'],  # Replace with specific domains for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input schema
class PredictionRequest(BaseModel):
    features: List[Union[float, str]]

@app.post("/predict")
def predict(request: PredictionRequest):

    try:
        # print("Function called", flush=True)
        input_array = list(request.features)
        print(input_array,flush=True)
        
        return {"prediction": float(websitePipeline.predict_proba(input_array)[0,1])} # changed for multi stage model
    except Exception as e:
        print(f"Error occurred: {e}", flush=True)
        return {"error": str(e)}

#run uvicorn app:app --reload
#to start the api server