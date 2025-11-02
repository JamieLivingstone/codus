import { IconButton } from '@chakra-ui/react';
import { Tooltip } from '@components/tooltip.tsx';
import { useTranslation } from '@i18n/hooks';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

interface SidebarToggleProps {
  isCollapsed: boolean;
  onClick: () => void;
}

export function SidebarToggle({ isCollapsed, onClick }: SidebarToggleProps) {
  const { t } = useTranslation();

  return (
    <Tooltip
      content={isCollapsed ? t('layout.sidebar.expand') : t('layout.sidebar.collapse')}
      positioning={{ placement: 'right' }}
      showArrow
    >
      <IconButton
        variant="ghost"
        size="sm"
        color="fg.muted"
        _hover={{
          color: 'fg',
          bg: 'bg.muted',
          transform: 'scale(1.05)',
        }}
        onClick={onClick}
        borderRadius="lg"
        transition="all 0.2s ease"
        data-testid="sidebar-toggle"
      >
        {isCollapsed ? (
          <LuChevronRight size={16} data-testid="expand-icon" />
        ) : (
          <LuChevronLeft size={16} data-testid="collapse-icon" />
        )}
      </IconButton>
    </Tooltip>
  );
}
