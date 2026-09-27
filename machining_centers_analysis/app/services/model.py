from fastapi import HTTPException

from app.crud.model import ModelCRUD


class ModelService:

    def __init__(self, session):

        self.crud = ModelCRUD(session)


    def get_models(self):

        models = self.crud.get_models()

        return [
            {
                "id": model.id,
                "name": model.name,
                "description": model.description,
                "framework": model.framework,
                "model_type": model.model_type,
                "task_type": model.task_type,
                "active": model.active
            }
            for model in models
        ]


    def get_model(self, model_id: str):

        model = self.crud.get_model_by_id(
            model_id
        )

        if model is None:

            raise HTTPException(
                status_code=404,
                detail="ML-модель не найдена."
            )

        return {
            "id": model.id,
            "name": model.name,
            "description": model.description,
            "framework": model.framework,
            "model_type": model.model_type,
            "task_type": model.task_type,
            "active": model.active
        }