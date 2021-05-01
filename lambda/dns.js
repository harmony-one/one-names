const Web3 = require('web3')
const ENS = require('@ensdomains/ensjs').default
const sha3 = require('web3-utils').sha3
const AWS = require('aws-sdk')
const WEB3_URL = process.env.WEB3_URL
const ENS_ADDRESS = process.env.ENS_ADDRESS

const registerDns = (subdomain) => {
  const dnsName = `${subdomain}.crazy.one.`

  const route53 = new AWS.Route53({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID_ONE,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ONE
  })

  console.log('test', process.env.AWS_ACCESS_KEY_ID_ONE)

  const params = {
    ChangeBatch: {
      Changes: [
        {
          Action: 'CREATE',
          ResourceRecordSet: {
            AliasTarget: {
              DNSName: 'd3n81svffwacl0.cloudfront.net.',
              HostedZoneId: 'Z2FDTNDATAQYW2',
              EvaluateTargetHealth: false
            },
            Name: dnsName,
            Type: 'A'
          }
        }
      ],
      Comment: 'Created via OneNames'
    },
    HostedZoneId: 'Z07603732N95PTMMN6HT2'
  }

  route53.changeResourceRecordSets(params, function (err, data) {
    if (err) {
      console.log(err, err.stack)
    } else {
      return data
    }
  })
}

const getLogs = async (txHash) => {
  const web3 = new Web3(WEB3_URL)
  const provider = new Web3.providers.HttpProvider(WEB3_URL)
  const ens = new ENS({ provider, ensAddress: ENS_ADDRESS })

  const receipt = await web3.eth.getTransactionReceipt(txHash)

  receipt.logs.forEach(async (log) => {
    try {
      const decoded = web3.eth.abi.decodeLog(
        [
          {
            indexed: true,
            name: 'label',
            type: 'bytes32'
          },
          {
            indexed: false,
            name: 'subdomain',
            type: 'string'
          },
          {
            indexed: true,
            name: 'owner',
            type: 'address'
          },
          {
            indexed: false,
            name: 'price',
            type: 'uint256'
          }
        ],
        log.data,
        log.topics.slice(1)
      )

      const subdomainRegisterAddress = await ens.name('crazy.one').getAddress()
      const checkDomain = decoded.label === sha3('crazy')
      const checkContract = receipt.to.toLowerCase() === subdomainRegisterAddress.toString().toLowerCase()

      // confirmed. OK to continue
      if (checkDomain && checkContract) {
        const subdomain = decoded.subdomain
        console.log('OK to register DNS', subdomain)
        registerDns(subdomain)
      } else {
        console.log('Error: could not verify domain or contract')
      }
    } catch (e) {}
  })
}

exports.handler = async function (event, context) {
  const body = JSON.parse(event.body)
  const tx = body.tx

  await getLogs(tx)

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'DNS record added' })
  }
}
