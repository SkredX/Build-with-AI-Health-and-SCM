import numpy as np

class FederatedLearningSimulator:
    def __init__(self):
        self.global_model_weights = np.zeros(5)
        self.states_contributed = []

    def train_local_model(self, state: str) -> np.ndarray:
        # Dummy linear regression on local disease data
        np.random.seed(hash(state) % 1000)
        local_weights = np.random.randn(5)
        self.states_contributed.append(state)
        return local_weights

    def aggregate_models(self, state_models: dict[str, np.ndarray]):
        if not state_models:
            return
        
        # FedAvg - simple mean of weights
        all_weights = list(state_models.values())
        self.global_model_weights = np.mean(all_weights, axis=0)

    def predict_with_global_model(self, features: np.ndarray) -> float:
        return float(np.dot(features, self.global_model_weights))

    def get_federation_status(self) -> dict:
        return {
            "states_contributed": list(set(self.states_contributed)),
            "global_model_accuracy": 0.85, # Dummy
            "global_model_weights": self.global_model_weights.tolist()
        }
