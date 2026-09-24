import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    // Flex-контейнер в колонку, чтобы шапка была сверху, а всё остальное снизу
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      {/* 1. Верхняя панель (Шапка) */}
      <Header />
      
      {/* 2. Нижняя часть: Сайдар + Контент */}
      <Box sx={{ display: 'flex', flexGrow: 1, pt: '64px' }}> 
        {/* pt: '64px' — это верхний отступ, чтобы контент не залезал под фиксированную шапку */}
        
        {/* Левая колонка: Сайбар */}
        <Box sx={{ width: '240px', flexShrink: 0 }}>
          <Sidebar />
        </Box>

        {/* Правая колонка: Основной контент (Окна роутера) */}
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>

      </Box>
    </Box>
  );
}