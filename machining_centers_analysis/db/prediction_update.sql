-- 1. Удаляем старую таблицу (если она существует)
DROP TABLE IF EXISTS predictions CASCADE;

-- 2. Создаем таблицу с новой структурой
CREATE TABLE predictions (
    id VARCHAR(50) PRIMARY KEY,
    batch_id VARCHAR(50) NOT NULL,
    training_run_id VARCHAR(50) NOT NULL,
    
    -- Разрешаем NULL для sample_id
    sample_id VARCHAR(50) NULL,
    
    -- Новые поля
    input_sample_id VARCHAR(100) NOT NULL,
    actual_wear FLOAT NULL,
    actual_class VARCHAR(50) NULL,
    
    predicted_class VARCHAR(50) NULL,
    confidence FLOAT NULL,
    probabilities JSONB NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    -- Ограничения и внешние ключи (Foreign Keys)
    CONSTRAINT fk_predictions_batch_id 
        FOREIGN KEY (batch_id) 
        REFERENCES prediction_batches(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_predictions_training_run_id 
        FOREIGN KEY (training_run_id) 
        REFERENCES training_runs(id),
        
    CONSTRAINT fk_predictions_sample_id 
        FOREIGN KEY (sample_id) 
        REFERENCES signal_samples(id) 
        ON DELETE RESTRICT
);