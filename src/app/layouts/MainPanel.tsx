import { DashboardContent } from "../features/dashboards/components/DashboardContent"

import { Box } from "@mui/material"

interface MainPanelProps {
    selectedItem: string;
    menuWidth?: number;
  }

export const MainPanel = ({ selectedItem, menuWidth = 69 }: MainPanelProps) => (
    <Box
        component="main"
        sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: '#18181b',
            padding: 0,
            minHeight: '100vh',
            marginLeft: `${menuWidth}px`,
            width: `calc(100% - ${menuWidth}px)`,
            position: 'relative',
        }}
    >
        {selectedItem === 'dashboard' && (
            <DashboardContent />
        )}
    </Box>
)