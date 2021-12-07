export type SolanaGifPortal = {
  version: "0.0.0";
  name: "solana_gif_portal";
  instructions: [
    {
      name: "startStuffOff";
      accounts: [
        {
          name: "baseAccount";
          isMut: true;
          isSigner: true;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "addGif";
      accounts: [
        {
          name: "baseAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        }
      ];
      args: [
        {
          name: "gifLink";
          type: "string";
        }
      ];
    },
    {
      name: "upvoteGif";
      accounts: [
        {
          name: "baseAccount";
          isMut: true;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "gifLink";
          type: "string";
        }
      ];
    },
    {
      name: "tip";
      accounts: [
        {
          name: "from";
          isMut: true;
          isSigner: true;
        },
        {
          name: "to";
          isMut: true;
          isSigner: false;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "string";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "baseAccount";
      type: {
        kind: "struct";
        fields: [
          {
            name: "totalGifs";
            type: "u64";
          },
          {
            name: "gifList";
            type: {
              vec: {
                defined: "ItemStruct";
              };
            };
          }
        ];
      };
    }
  ];
  types: [
    {
      name: "ItemStruct";
      type: {
        kind: "struct";
        fields: [
          {
            name: "gifLink";
            type: "string";
          },
          {
            name: "userAddress";
            type: "publicKey";
          },
          {
            name: "upvotes";
            type: "u64";
          }
        ];
      };
    }
  ];
};

export const IDL: SolanaGifPortal = {
  version: "0.0.0",
  name: "solana_gif_portal",
  instructions: [
    {
      name: "startStuffOff",
      accounts: [
        {
          name: "baseAccount",
          isMut: true,
          isSigner: true,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "addGif",
      accounts: [
        {
          name: "baseAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "user",
          isMut: true,
          isSigner: true,
        },
      ],
      args: [
        {
          name: "gifLink",
          type: "string",
        },
      ],
    },
    {
      name: "upvoteGif",
      accounts: [
        {
          name: "baseAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "gifLink",
          type: "string",
        },
      ],
    },
    {
      name: "tip",
      accounts: [
        {
          name: "from",
          isMut: true,
          isSigner: true,
        },
        {
          name: "to",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "amount",
          type: "string",
        },
      ],
    },
  ],
  accounts: [
    {
      name: "baseAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "totalGifs",
            type: "u64",
          },
          {
            name: "gifList",
            type: {
              vec: {
                defined: "ItemStruct",
              },
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "ItemStruct",
      type: {
        kind: "struct",
        fields: [
          {
            name: "gifLink",
            type: "string",
          },
          {
            name: "userAddress",
            type: "publicKey",
          },
          {
            name: "upvotes",
            type: "u64",
          },
        ],
      },
    },
  ],
};
