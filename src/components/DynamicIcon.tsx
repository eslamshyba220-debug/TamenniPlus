/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = '', size = 24 }) => {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    // Fallback to a standard medical/help icon if not found
    return <Icons.Activity className={className} size={size} />;
  }
  return <IconComponent className={className} size={size} />;
};
export default DynamicIcon;
