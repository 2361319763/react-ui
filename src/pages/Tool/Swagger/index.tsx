import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';

const CacheInfo: React.FC = () => {
  useEffect(() => {
    const frame = document.getElementById('bdIframe');
    if (frame) {
      const deviceWidth = document.documentElement.clientWidth;
      const deviceHeight = document.documentElement.clientHeight;
      frame.style.width = `${Number(deviceWidth) - 320}px`;
      frame.style.height = `${Number(deviceHeight) - 120}px`;
    }
  });

  return (
    <div style={{}}>
      <iframe
        style={{ width: '100%', border: '0px', height: '100%' }}
        src={`/dev-api/swagger-ui/index.html`}
        id="bdIframe"
      />
    </div>
  );
};

export default CacheInfo;
