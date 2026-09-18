import uuid


class UUIDClass():

    def __init__(self):

        self.mlModelsIDList = []
        self.training_runIDList = []

    @staticmethod
    def geterateUUIDWithout_():
        #Генерация ключа
        myuuid = uuid.uuid4()
        myuuid_str = str(myuuid)
        # Избавление от "-"
        myuuid_str_ = myuuid_str.replace('-', '')
        return myuuid_str_