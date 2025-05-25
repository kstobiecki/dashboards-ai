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
        {(selectedItem === 'hosting' || selectedItem === 'integrations' || selectedItem === 'settings') && (
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                color: '#e5e7eb',
            }}>
                <Box sx={{
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderRadius: 2,
                    px: 5,
                    py: 3,
                    boxShadow: 2,
                }}>
                    <span style={{ fontSize: 24, fontWeight: 600 }}>Coming soon...</span>
                    <br />
                    <span style={{ color: '#6b7280', fontSize: 16 }}>This feature is under development. Stay tuned!</span>
                </Box>
            </Box>
        )}
    </Box>
)