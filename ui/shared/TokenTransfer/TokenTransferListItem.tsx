import { Flex, Skeleton } from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import React from 'react';

import type { TokenTransfer } from 'types/api/tokenTransfer';

import eastArrowIcon from 'icons/arrows/east.svg';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import Icon from 'ui/shared/chakra/Icon';
import Tag from 'ui/shared/chakra/Tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TokenEntity from 'ui/shared/entities/token/TokenEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import InOutTag from 'ui/shared/InOutTag';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import { getTokenTransferTypeText } from 'ui/shared/TokenTransfer/helpers';
import TokenTransferNft from 'ui/shared/TokenTransfer/TokenTransferNft';
import TxAdditionalInfo from 'ui/txs/TxAdditionalInfo';

type Props = TokenTransfer & {
  baseAddress?: string;
  showTxInfo?: boolean;
  enableTimeIncrement?: boolean;
  isLoading?: boolean;
}

const TokenTransferListItem = ({
  token,
  total,
  tx_hash: txHash,
  from,
  to,
  baseAddress,
  showTxInfo,
  type,
  timestamp,
  enableTimeIncrement,
  isLoading,
}: Props) => {
  const value = (() => {
    if (!('value' in total)) {
      return null;
    }

    return BigNumber(total.value).div(BigNumber(10 ** Number(total.decimals))).dp(8).toFormat();
  })();

  const timeAgo = useTimeAgoIncrement(timestamp, enableTimeIncrement);

  const addressWidth = `calc((100% - ${ baseAddress ? '50px - 24px' : '24px - 24px' }) / 2)`;
  return (
    <ListItemMobile rowGap={ 3 } isAnimated>
      <Flex w="100%" justifyContent="space-between">
        <Flex flexWrap="wrap" rowGap={ 1 } mr={ showTxInfo && txHash ? 2 : 0 } columnGap={ 2 } overflow="hidden">
          <TokenEntity
            token={ token }
            isLoading={ isLoading }
            noSymbol
            noCopy
            w="auto"
          />
          <Tag flexShrink={ 0 } isLoading={ isLoading }>{ token.type }</Tag>
          <Tag colorScheme="orange" isLoading={ isLoading }>{ getTokenTransferTypeText(type) }</Tag>
        </Flex>
        { showTxInfo && txHash && (
          <TxAdditionalInfo hash={ txHash } isMobile isLoading={ isLoading }/>
        ) }
      </Flex>
      { 'token_id' in total && <TokenTransferNft hash={ token.address } id={ total.token_id } isLoading={ isLoading }/> }
      { showTxInfo && txHash && (
        <Flex justifyContent="space-between" alignItems="center" lineHeight="24px" width="100%">
          <TxEntity
            isLoading={ isLoading }
            hash={ txHash }
            truncation="constant"
            fontWeight="700"
          />
          { timestamp && (
            <Skeleton isLoaded={ !isLoading } color="text_secondary" fontWeight="400" fontSize="sm">
              <span>{ timeAgo }</span>
            </Skeleton>
          ) }
        </Flex>
      ) }
      <Flex w="100%" columnGap={ 3 }>
        <AddressEntity
          address={ from }
          isLoading={ isLoading }
          noLink={ baseAddress === from.hash }
          noCopy={ baseAddress === from.hash }
          flexShrink={ 0 }
          width={ addressWidth }
        />
        { baseAddress ? (
          <InOutTag
            isIn={ baseAddress === to.hash }
            isOut={ baseAddress === from.hash }
            w="50px"
            textAlign="center"
            isLoading={ isLoading }
            flexShrink={ 0 }
          />
        ) :
          <Icon as={ eastArrowIcon } boxSize={ 6 } color="gray.500" isLoading={ isLoading } flexShrink={ 0 }/>
        }
        <AddressEntity
          address={ to }
          isLoading={ isLoading }
          noLink={ baseAddress === to.hash }
          noCopy={ baseAddress === to.hash }
          flexShrink={ 0 }
          width={ addressWidth }
        />
      </Flex>
      { value && (
        <Flex columnGap={ 2 } w="100%">
          <Skeleton isLoaded={ !isLoading } fontWeight={ 500 } flexShrink={ 0 }>Value</Skeleton>
          <Skeleton isLoaded={ !isLoading } color="text_secondary"><span>{ value }</span></Skeleton>
        </Flex>
      ) }
    </ListItemMobile>
  );
};

export default React.memo(TokenTransferListItem);
