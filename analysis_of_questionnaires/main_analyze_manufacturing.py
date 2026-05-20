import pandas as pd
import numpy as np
import re
import matplotlib.pyplot as plt

FILE_PATH = "data/2026-05-20 Подготовка специалистов по анализу данных в промышленности.xlsx"
SAFE_PATH = "results"
# ==============================
# ФУНКЦИИ
# ==============================

def extract_number(value):
    if pd.isna(value):
        return np.nan
    match = re.search(r"[1-5]", str(value))
    return int(match.group()) if match else np.nan

def safe_mean(df, cols):
    return df[cols].applymap(extract_number).mean().mean()

def percent_distribution(series):
    return (series.value_counts(normalize=True) * 100).round(1)

# ==============================
# ЗАГРУЗКА
# ==============================

df = pd.read_excel(FILE_PATH)

print("\n=== БАЗОВЫЕ ПОКАЗАТЕЛИ ===")

N = len(df)
print(f"Количество респондентов: {N}")

# ==============================
# 1. ОТРАСЛИ
# ==============================

col_industry = [c for c in df.columns if "отрасль" in c.lower()][0]
industry_dist = percent_distribution(df[col_industry])

print("\nРаспределение по отраслям (%):")
print(industry_dist)

# ==============================
# 2. ЦИФРОВАЯ ЗРЕЛОСТЬ
# ==============================

def map_maturity(val):
    if pd.isna(val):
        return np.nan
    val = str(val).lower()
    if "активно" in val or val == "да":
        return 2
    elif "частично" in val or "планируется" in val:
        return 1
    else:
        return 0

col_data = [c for c in df.columns if "данны" in c.lower()][0]
col_ml = [c for c in df.columns if "машинного" in c.lower() or "ml" in c.lower()][0]

maturity = df[col_data].apply(map_maturity) + df[col_ml].apply(map_maturity)
maturity_index = maturity.mean()

print(f"\nИндекс цифровой зрелости: {maturity_index:.2f}")

# ==============================
# 3. ВОСТРЕБОВАННОСТЬ
# ==============================

col_demand = [c for c in df.columns if "востребованы" in c.lower()][0]
demand_index = df[col_demand].apply(extract_number).mean()

print(f"Индекс востребованности: {demand_index:.2f}")

# ==============================
# 4. НАВЫКИ
# ==============================

col_skills = [c for c in df.columns if "навык" in c.lower()][0]

skills_series = df[col_skills].dropna()

skills = {}
for entry in skills_series:
    for skill in str(entry).split(","):
        skill = skill.strip()
        skills[skill] = skills.get(skill, 0) + 1

skills_df = pd.DataFrame.from_dict(skills, orient='index', columns=['count'])
skills_df['percent'] = (skills_df['count'] / N * 100).round(1)
skills_df = skills_df.sort_values(by='percent', ascending=False)

print("\nНавыки (%):")
print(skills_df)

# ==============================
# 5. ИНТЕРЕС К ВЫПУСКНИКАМ
# ==============================

col_interest = [c for c in df.columns if "интерес" in c.lower()][0]
interest_index = df[col_interest].apply(extract_number).mean()

print(f"\nИндекс интереса к выпускникам: {interest_index:.2f}")

# ==============================
# 6. ПРАКТИКО-ОРИЕНТИРОВАННОСТЬ
# ==============================

practice_cols = [c for c in df.columns if "лаборатор" in c.lower() or "кейс" in c.lower()]
practice_index = safe_mean(df, practice_cols)

print(f"Индекс практико-ориентированности: {practice_index:.2f}")

# ==============================
# 7. СОТРУДНИЧЕСТВО
# ==============================

col_coop = [c for c in df.columns if "участвовать" in c.lower()][0]
coop_dist = percent_distribution(df[col_coop])

coop_rate = coop_dist.get("да ", 0) + coop_dist.get("возможно ", 0)

print("\nГотовность к сотрудничеству (%):")
print(coop_dist)

print(f"Доля потенциального сотрудничества: {coop_rate:.1f}%")

# ==============================
# 8. ПАРТНЕРЫ
# ==============================

contact_cols = [c for c in df.columns if "email" in c.lower() or "компания" in c.lower()]

partners = df[contact_cols].dropna(how="all")
partners_count = len(partners)

print(f"\nКоличество потенциальных партнёров: {partners_count}")

# ==============================
# 9. ГРАФИКИ
# ==============================

plt.figure()
industry_dist.plot(kind="bar")
plt.title("Отрасли")
plt.tight_layout()
plt.savefig(SAFE_PATH+"\\" +"industry.png")

plt.figure()
skills_df['percent'].plot(kind="bar")
plt.title("Навыки")
plt.tight_layout()
plt.savefig(SAFE_PATH+"\\" +"skills.png")

plt.figure()
coop_dist.plot(kind="bar")
plt.title("Сотрудничество")
plt.tight_layout()
plt.savefig(SAFE_PATH+"\\" +"cooperation.png")

# ==============================
# 10. СВОДНАЯ ТАБЛИЦА
# ==============================

summary = pd.DataFrame({
    "Показатель": [
        "Количество респондентов",
        "Цифровая зрелость",
        "Востребованность",
        "Интерес к выпускникам",
        "Практико-ориентированность",
        "Готовность к сотрудничеству (%)",
        "Партнёры (шт)"
    ],
    "Значение": [
        N,
        round(maturity_index, 2),
        round(demand_index, 2),
        round(interest_index, 2),
        round(practice_index, 2),
        round(coop_rate, 1),
        partners_count
    ]
})

summary.to_excel(SAFE_PATH+"\\" +"summary.xlsx", index=False)

print("\nСводная таблица сохранена в summary.xlsx")

# ==============================
# 11. ТЕКСТ ДЛЯ ОТЧЁТА
# ==============================

report_text = f"""
По результатам опроса {N} представителей предприятий:

- Средний уровень цифровой зрелости составил {maturity_index:.2f}
- Востребованность специалистов по анализу данных — {demand_index:.2f} из 5
- Интерес к выпускникам — {interest_index:.2f} из 5
- Практико-ориентированность обучения — {practice_index:.2f} из 5
- Доля предприятий, готовых к сотрудничеству — {coop_rate:.1f}%
- Получено {partners_count} потенциальных партнёров

Полученные результаты подтверждают актуальность подготовки специалистов в области анализа данных и ИИ для промышленности.
"""

with open(SAFE_PATH+"\\" +"report.txt", "w", encoding="utf-8") as f:
    f.write(report_text)

print("\nТекст отчёта сохранён в report.txt")