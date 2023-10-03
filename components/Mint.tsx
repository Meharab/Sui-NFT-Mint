import { createFactory, useCallback, useEffect, useState } from 'react'
import { ethos, TransactionBlock } from 'ethos-connect'
import { SuccessMessage } from '.';
import { ETHOS_EXAMPLE_CONTRACT } from '../lib/constants';
import { NextPage } from 'next';

const Mint: NextPage = () => {
    const { wallet } = ethos.useWallet();
    const [nftObjectId, setNftObjectId] = useState<string | undefined>();
    const [nftName, setNftName] = useState('My NFT');
    const [nftDescription, setNftDescription] = useState('My NFT Description');
    const [nftImgUrl, setNftImgUrl] = useState('IPFS Link recommended');

    const mint = useCallback(async () => {
        if (!wallet?.currentAccount) return;
    
        try {
          const transactionBlock = new TransactionBlock();
          transactionBlock.moveCall({
            target: `${ETHOS_EXAMPLE_CONTRACT}::ethos_example_nft::mint_to_sender`,
            arguments: [
              transactionBlock.pure(nftName),
              transactionBlock.pure(nftDescription),
              transactionBlock.pure(nftImgUrl),
            ]
          })
    
          const response = await wallet.signAndExecuteTransactionBlock({
            transactionBlock,
            options: {
              showObjectChanges: true,
            }
          });
          
          if (response?.objectChanges) {
            const createdObject = response.objectChanges.find(
              (e) => e.type === "created"
            );
            if (createdObject && "objectId" in createdObject) {
              setNftObjectId(createdObject.objectId)
            }
          }  
        } catch (error) {
          console.log(error);
        }
    }, [wallet]);

    const reset = useCallback(() => {
        setNftObjectId(undefined)
    }, [])

    useEffect(() => {
        reset()
    }, [reset])

    function handleNftNameChange(e: React.ChangeEvent<HTMLInputElement>) {
      setNftName(e.target.value);
    }

    function handleDescriptionChange(e: React.ChangeEvent<HTMLInputElement>) {
      setNftDescription(e.target.value);
    }

    function handleNftImgUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
      setNftImgUrl(e.target.value);
    }

    console.log(nftName);
    console.log(nftDescription);
    console.log(nftImgUrl);

    return (
        <div className='flex flex-col gap-6'>
            {nftObjectId && (
                <SuccessMessage reset={reset}>
                    <a 
                        href={`https://explorer.sui.io/objects/${nftObjectId}?network=testnet`}
                        target="_blank" 
                        rel="noreferrer"
                        className='underline font-blue-600' 
                    >
                        View Your NFT on the TestNet Explorer 
                    </a>
                </SuccessMessage>
            )}
              <input type="text" value={nftName} onChange={handleNftNameChange} />
              <input type="text" value={nftDescription} onChange={handleDescriptionChange} />
              <input type="text" value={nftImgUrl} onChange={handleNftImgUrlChange} />
              <button
                  className="mx-auto px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  onClick={mint}
              >
                  Mint
              </button>
        </div>
    )
}

export default Mint;