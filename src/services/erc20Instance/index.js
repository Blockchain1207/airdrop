
import { Contract } from '@ethersproject/contracts'

import { erc20ABI } from '../../abis/erc20';

const erc20Instance =  (address, account, chainId, library) => {
    if (chainId) {
        return new Contract(address, erc20ABI, library.getSigner(account));
    }
    return null
}

export {
    erc20Instance
}
