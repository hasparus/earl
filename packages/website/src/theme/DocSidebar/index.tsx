/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  MobileSecondaryMenuComponent,
  MobileSecondaryMenuFiller,
  ThemeClassNames,
  useAnnouncementBar,
  useScrollPosition,
  useThemeConfig,
} from '@docusaurus/theme-common'
import { translate } from '@docusaurus/Translate'
import type { Props } from '@theme/DocSidebar'
import { DocSidebarItems } from '@theme/DocSidebarItem'
import useWindowSize from '@theme/hooks/useWindowSize'
import IconArrow from '@theme/IconArrow'
import Logo from '@theme/Logo'
import clsx from 'clsx'
import React, { useState } from 'react'

import styles from './styles.module.css'

function useShowAnnouncementBar() {
  const { isActive } = useAnnouncementBar()
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(isActive)

  useScrollPosition(
    ({ scrollY }) => {
      if (isActive) {
        setShowAnnouncementBar(scrollY === 0)
      }
    },
    [isActive],
  )
  return isActive && showAnnouncementBar
}

function HideableSidebarButton({ onClick }: { onClick: React.MouseEventHandler }) {
  return (
    <button
      type="button"
      title={translate({
        id: 'theme.docs.sidebar.collapseButtonTitle',
        message: 'Collapse sidebar',
        description: 'The title attribute for collapse button of doc sidebar',
      })}
      aria-label={translate({
        id: 'theme.docs.sidebar.collapseButtonAriaLabel',
        message: 'Collapse sidebar',
        description: 'The title attribute for collapse button of doc sidebar',
      })}
      className={clsx('button button--secondary button--outline', styles.collapseSidebarButton)}
      onClick={onClick}
    >
      <IconArrow className={styles.collapseSidebarButtonIcon} />
    </button>
  )
}

function DocSidebarDesktop({ path, sidebar, onCollapse, isHidden }: Props) {
  const showAnnouncementBar = useShowAnnouncementBar()
  const {
    navbar: { hideOnScroll },
    hideableSidebar,
  } = useThemeConfig()

  return (
    <div
      className={clsx(styles.sidebar, styles.earl__sidebar, {
        [styles.sidebarWithHideableNavbar]: hideOnScroll,
        [styles.sidebarHidden]: isHidden,
      })}
    >
      {hideOnScroll && <Logo tabIndex={-1} className={styles.sidebarLogo} />}
      <nav
        className={clsx('menu thin-scrollbar', styles.earl__sidebarMenu, styles.menu, {
          [styles.menuWithAnnouncementBar]: showAnnouncementBar,
        })}
      >
        <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}>
          <DocSidebarItems items={sidebar} activePath={path} level={1} />
        </ul>
      </nav>
      {hideableSidebar && <HideableSidebarButton onClick={onCollapse} />}
    </div>
  )
}

const DocSidebarMobileSecondaryMenu: MobileSecondaryMenuComponent<Props> = ({ toggleSidebar, sidebar, path }) => {
  return (
    <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}>
      <DocSidebarItems items={sidebar} activePath={path} onItemClick={() => toggleSidebar()} level={1} />
    </ul>
  )
}

function DocSidebarMobile(props: Props) {
  return <MobileSecondaryMenuFiller component={DocSidebarMobileSecondaryMenu} props={props} />
}

const DocSidebarDesktopMemo = React.memo(DocSidebarDesktop)
const DocSidebarMobileMemo = React.memo(DocSidebarMobile)

export default function DocSidebar(props: Props): JSX.Element {
  const windowSize = useWindowSize()

  // Desktop sidebar visible on hydration: need SSR rendering
  const shouldRenderSidebarDesktop = windowSize === 'desktop' || windowSize === 'ssr'

  // Mobile sidebar not visible on hydration: can avoid SSR rendering
  const shouldRenderSidebarMobile = windowSize === 'mobile'

  return (
    <>
      {shouldRenderSidebarDesktop && <DocSidebarDesktopMemo {...props} />}
      {shouldRenderSidebarMobile && <DocSidebarMobileMemo {...props} />}
    </>
  )
}
