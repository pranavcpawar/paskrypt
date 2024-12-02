/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/paskrypt.json`.
 */
export type Paskrypt = {
  "address": "8R5t4StGwtvamNBx8PsMGnPYGT6Q9CRwRtSDLjBRTK15",
  "metadata": {
    "name": "paskrypt",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "createPasswordEntry",
      "discriminator": [
        183,
        159,
        189,
        61,
        181,
        208,
        31,
        13
      ],
      "accounts": [
        {
          "name": "passwordEntry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "username"
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        },
        {
          "name": "password",
          "type": "string"
        }
      ]
    },
    {
      "name": "deletePasswordEntry",
      "discriminator": [
        245,
        89,
        232,
        174,
        120,
        179,
        64,
        6
      ],
      "accounts": [
        {
          "name": "passwordEntry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "username"
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        }
      ]
    },
    {
      "name": "updatePasswordEntry",
      "discriminator": [
        29,
        150,
        158,
        155,
        111,
        136,
        22,
        42
      ],
      "accounts": [
        {
          "name": "passwordEntry",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "arg",
                "path": "username"
              },
              {
                "kind": "account",
                "path": "owner"
              }
            ]
          }
        },
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "username",
          "type": "string"
        },
        {
          "name": "password",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "passwordEntryState",
      "discriminator": [
        112,
        71,
        211,
        43,
        142,
        123,
        120,
        54
      ]
    }
  ],
  "types": [
    {
      "name": "passwordEntryState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "password",
            "type": "string"
          }
        ]
      }
    }
  ]
};
