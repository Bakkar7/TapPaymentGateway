import React, { useEffect } from 'react'

import { GoSell } from "@tap-payments/gosell"

const config = {
  containerID:"tapRoot",
  gateway: {
  publicKey: 'pk_test_YIot2mCfveUZ8RT9z34gbNEl',
  }
}

/**
 * TAP payment gateway.
 */
const TapPaymentGateway = ({
  open = false
}) => {
  GoSell.config = config
  useEffect(() => {
   if(open) {
    GoSell.openLightBox()
   }
  }, [open])

  return (
    <div id="tapRoot"/>
  );
};


export { TapPaymentGateway };
