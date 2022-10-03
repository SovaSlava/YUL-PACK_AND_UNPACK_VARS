object "Contract" {
    code {
       codecopy(
          callvalue(), // 0x00
          dataoffset("runtime"),
          datasize("runtime")
        )
        setimmutable(
          returndatasize(), // 0x00
          "owner", // name
          caller() // msg.sender
        )     
        return(callvalue(), datasize("runtime"))
    }

    object "runtime" {
        code {
            if iszero(eq(caller(), loadimmutable("owner"))) {
                revert(returndatasize(), returndatasize())   
            }
          
              switch calldatasize()
                case 20 /* update address */ {
                    let newAddress := shr(0x60,calldataload(returndatasize()))
                    let mask := not(0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
                    let zeroBytes := and(mask, sload(returndatasize()))
                    sstore(
                        returndatasize(),
                        or(newAddress, zeroBytes)
                    )
                }
                case 4 /* update timestamp */ {
                    let newTimestamp := shr(0x40,calldataload(returndatasize()))
                    let mask := not(mul(0xFFFFFFFF, exp(0x0100,0x14)))
                    let zeroBytes := and(mask, sload(returndatasize()))
                    sstore(
                        returndatasize(),
                        or(newTimestamp, zeroBytes)
                    )
                }
                case 1 /* read */ {
                    switch shr(0xF8, calldataload(returndatasize()))
                        case 0x01 /* address */ {
                            let slot0 := sload(returndatasize())
                            let mask := 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
                            mstore(0, and(slot0, mask))
                            return(0x0C, 0x14)   //  return 12 20
                        }
                        case 0x02 /* timestamp */ {
                            let slot0 := sload(returndatasize())
                            let mask := mul(0xFFFFFFFF, exp(0x0100,0x14))
                            mstore(0, shr(0xA0, and(slot0, mask)))
                            return(0x1C, 0x04)   //  return 28 4 
                             
                        }
                        default {
                            revert(returndatasize(), returndatasize())
                        }
                }
                default {
                    revert(returndatasize(), returndatasize())
                }
            }
        } 
    }