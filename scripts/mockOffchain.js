// // const { ethers, network } = require("hardhat")

// // async function mockKeepers() {
// //     const raffle = await ethers.getContract("Raffle")
// //     const checkData = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(""))
// //     const { upkeepNeeded } = await raffle.callStatic.checkUpkeep(checkData)
// //     if (upkeepNeeded) {
// //         const tx = await raffle.performUpkeep(checkData)
// //         const txReceipt = await tx.wait(1)
// //         const requestId = txReceipt.events[1].args.requestId
// //         console.log(`Performed upkeep with RequestId: ${requestId}`)
// //         if (network.config.chainId == 31337) {
// //             await mockVrf(requestId, raffle)
// //         }
// //     } else {
// //         console.log("No upkeep needed!")
// //     }
// // }

// async function mockVrf(requestId, raffle) {
//     console.log("We on a local network? Ok let's pretend...")
//     const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
//     await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)
//     console.log("Responded!")
//     const recentWinner = await raffle.getRecentWinner()
//     console.log(`The winner is: ${recentWinner}`)
// }

// mockKeepers()
//     .then(() => process.exit(0))
//     .catch((error) => {
//         console.error(error)
//         process.exit(1)
//     })


const { ethers, network } = require("hardhat")
async function mockKeepers() {
    const raffle = await ethers.getContract("Raffle");
    // console.log("Raffle Contract:", raffle);

    // Using await and destructuring syntax for the tuple result from checkUpkeep
    const checkData = ethers.AbiCoder.defaultAbiCoder().encode(["string"], [""]);
    const [upkeepNeeded] = await raffle.checkUpkeep.staticCall(checkData); // Note destructuring here

    if (upkeepNeeded) {
        const tx = await raffle.performUpkeep(checkData);
        const txReceipt = await tx.wait(1);
        const requestId = await txReceipt.events[0].args.requestId;
        console.log("Transaction Receipt Events:", txReceipt.events);

        console.log(`Performed upkeep with RequestId: ${requestId}`);

        if (network.config.chainId === 31337) {
            await mockVrf(requestId, raffle);
        }
    } else {
        console.log("No upkeep needed!");
    }
}

async function mockVrf(requestId, raffle) {
    console.log("We on a local network? Ok let's pretend...");
    const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
    await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.target); // Use target for address in ethers v6
    console.log("Responded!");
    const recentWinner = await raffle.getRecentWinner();
    console.log(`The winner is: ${recentWinner}`);
}

mockKeepers()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });



