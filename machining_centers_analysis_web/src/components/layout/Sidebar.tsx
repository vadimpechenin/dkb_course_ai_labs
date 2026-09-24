import { NavLink } from "react-router-dom";


export default function Sidebar() {

    return (
        <nav>

            <h2>
                Классификация износа
            </h2>

            <NavLink to="/dashboard">
                Dashboard
            </NavLink>

            <NavLink to="/datasets">
                Данные
            </NavLink>

            <NavLink to="/features">
                Признаки
            </NavLink>

            <NavLink to="/training">
                Обучение
            </NavLink>

            <NavLink to="/predictions">
                Результаты
            </NavLink>

        </nav>
    );
}