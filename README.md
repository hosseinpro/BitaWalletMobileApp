# BitaWalletMobileApp

BitaWallet is a hardware crypto wallet designed with advanced security features, including cryptographic backup and a super-wallet/sub-wallet architecture. Originally conceived as my Ph.D. project over four years, BitaWallet has evolved into a fully-fledged product, laying the foundation for a promising startup. Detailed information on its development and underlying technologies can be found in the publication section, showcasing the research papers published during the project's academic phase.

The core cryptography for BitaWallet is implemented using JavaCard technologies. I developed the micro-controller codes in a Java-like language, compiling them to run on the Java Card Runtime Environment (JCRE). These codes have been rigorously tested through simulations and on multiple real chips from various manufacturers.

A standout feature of BitaWallet is its use of ePaper technology, providing a secure, trusted display on the card. This enhances the wallet's security by ensuring that sensitive information is displayed safely and clearly. Additionally, I utilized React Native to develop the accompanying Android and iOS applications, integrating custom native codes to handle the cryptographic operations.

BitaWallet leverages the smartphone's NFC antenna to communicate with the smart (IC) chip embedded in a credit card, facilitating secure cryptographic transactions. The backup procedure is both innovative and secure: users can clone their hardware wallet to another hardware wallet using a specialized cryptographic protocol, ensuring that no hacker can intercept the process. This approach eliminates the need for complex paper backups with numerous words, reducing the risk of exposure and enhancing user convenience.

Experience unparalleled security and ease of use with BitaWallet, the next generation in hardware crypto wallets.

