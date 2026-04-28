import pandas as pd
import numpy as np

FILE_PATH = "data\\2026-04-23 ТЕСТ Оценка курса Базы данных и базы знан.xlsx"

# ==============================
# ЗАГРУЗКА ДАННЫХ
# ==============================

df_sat = pd.read_excel(FILE_PATH, sheet_name="Оценка удовлетворенности курсом")
df_sat = df_sat.replace(r"^\s*$", np.nan, regex=True)
df_vkr = pd.read_excel(FILE_PATH, sheet_name="Использование курса для ВКР")
df_vkr = df_vkr.replace(r"^\s*$", np.nan, regex=True)
df_env = pd.read_excel(FILE_PATH, sheet_name="Формирование учебной среды")
df_env = df_env.replace(r"^\s*$", np.nan, regex=True)
# ==============================
# ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
# ==============================

import re


def extract_number(value):
    if pd.isna(value):
        return np.nan

    # ищем первую цифру 1-5
    match = re.search(r"[1-5]", str(value))
    if match:
        return int(match.group())

    return np.nan


def mean_block(df, keywords):
    cols = [c for c in df.columns if any(k in c for k in keywords)]

    if not cols:
        return np.nan, []

    # применяем извлечение чисел
    df_numeric = df[cols].applymap(extract_number)

    return df_numeric.mean().mean(), cols

def print_block(name, value):
    print(f"{name}: {value:.2f}")

# ==============================
# АНКЕТА 1 — УДОВЛЕТВОРЕННОСТЬ
# ==============================

print("\n=== АНКЕТА 1: УДОВЛЕТВОРЕННОСТЬ ===")

# Индексы по блокам
blocks = {
    "Общая удовлетворённость": ["1.", "29.", "30."],
    "Содержание": ["2.", "3.", "5."],
    "Лекции": ["6.", "7.", "8.", "9.", "10."],
    "Лабораторные": ["11.", "12.", "13.", "14.", "15.", "16."],
    "Инструменты": ["17.", "18.", "19.", "20."],
    "Результаты обучения": ["24.", "25.", "26.", "27.", "28."]
}

results_sat = {}

for name, keys in blocks.items():
    val, _ = mean_block(df_sat, keys)
    results_sat[name] = val
    print_block(name, val)

overall_sat = np.mean(list(results_sat.values()))
print_block("ИТОГОВАЯ ОЦЕНКА КУРСА", overall_sat)

# ==============================
# АНКЕТА 2 — ВКР
# ==============================

print("\n=== АНКЕТА 2: ВКР ===")

# 1. Доля использования
usage = df_vkr["1.\tВы используете материалы курса в своей ВКР? "]

used = usage.str.strip().str.capitalize().isin(["Да", "Частично"]).sum()
total = len(usage)

usage_rate = used / total if total > 0 else 0
print(f"Доля использования курса в ВКР: {usage_rate:.2%}")

# 2. Индекс влияния
impact_cols = [c for c in df_vkr.columns if any(x in c for x in ["3.", "4.", "5.", "6.", "7."])]
df_impact = df_vkr[impact_cols].applymap(extract_number)
impact_index = df_impact.mean().mean()

print_block("Индекс влияния курса", impact_index)


# 3. Индекс полезности
usefulness_cols = [c for c in df_vkr.columns if any(x in c for x in ["10.", "11.", "12."])]

df_usefulness = df_vkr[usefulness_cols].applymap(extract_number)
usefulness_index = df_usefulness.mean().mean()

print_block("Индекс полезности", usefulness_index)


# 4. Компетенции
competence_cols = [c for c in df_vkr.columns if any(x in c for x in ["13.", "14.", "15.", "16."])]

df_comp = df_vkr[competence_cols].applymap(extract_number)
competence_index = df_comp.mean().mean()
print_block("Индекс компетенций", competence_index)

# ==============================
# АНКЕТА 3 — УЧЕБНАЯ СРЕДА
# ==============================

print("\n=== АНКЕТА 3: УЧЕБНАЯ СРЕДА ===")

# 1. Уровень программирования
prog_level = df_env["1.\tОцените свой уровень программирования"].value_counts(normalize=True)
print("\nУровень программирования:")
print(prog_level)

# 2. Комфорт с кодом
df_comfort = df_env["3.\tНасколько вам комфортно работать с кодом?"]
comfort = df_comfort.apply(extract_number).mean()
print_block("Комфорт работы с кодом", comfort)

# 3. Важность no-code
nocode = df_env["4.\tНасколько важно для вас, чтобы лабораторные работы можно было выполнять без программирования?"].apply(extract_number).mean()
print_block("Важность работы без кода", nocode)

# 4. UI требования
ui_cols = [c for c in df_env.columns if "8." in c]
df_ui = df_env[ui_cols].applymap(extract_number)
ui_index = df_ui.mean().mean()
print_block("Индекс требований к интерфейсу", ui_index)

# 5. Инфраструктура
infra_cols = [c for c in df_env.columns if "6." in c]
df_infra_index= df_env[infra_cols].applymap(extract_number)
infra_index = df_infra_index.mean().mean()
print_block("Индекс требований к инфраструктуре", infra_index)

# 6. Интеграция технологий
integration_cols = [c for c in df_env.columns if "15." in c]
df_integration_index= df_env[integration_cols].applymap(extract_number)
integration_index = df_integration_index.mean().mean()
print_block("Интерес к интеграции технологий", integration_index)

# ==============================
# СОХРАНЕНИЕ РЕЗУЛЬТАТОВ
# ==============================

summary = pd.DataFrame({
    "Метрика": [
        "Удовлетворённость курсом",
        "Использование в ВКР",
        "Индекс влияния",
        "Индекс компетенций",
        "Комфорт с кодом",
        "No-code важность"
    ],
    "Значение": [
        overall_sat,
        usage_rate,
        impact_index,
        competence_index,
        comfort,
        nocode
    ]
})

summary.to_excel("results\\results_summary.xlsx", index=False)

print("\nРезультаты сохранены в results_summary.xlsx")