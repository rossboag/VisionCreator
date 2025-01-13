import { GetStaticProps } from 'next'
import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

const SwaggerUI = dynamic(import('swagger-ui-react'), { ssr: false })

export default function ApiDocs({ spec }: { spec: Record<string, any> }) {
  return <SwaggerUI spec={spec} />
}

export const getStaticProps: GetStaticProps = async () => {
  const swaggerJsdoc = require('swagger-jsdoc')

  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'VisionCreator API',
        version: '1.0.0',
        description: 'API documentation for VisionCreator',
      },
    },
    apis: ['./pages/api/**/*.ts'], // Path to the API docs
  }

  const spec = swaggerJsdoc(options)

  return {
    props: {
      spec,
    },
  }
}

