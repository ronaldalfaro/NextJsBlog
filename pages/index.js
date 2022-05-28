import styles from '../styles/Home.module.css';
import { GraphQLClient, gql } from 'graphql-request';

import Header from '../components/Header';
import BlogCard from '../components/BlogCard';

const graphcms = new GraphQLClient(
  'https://api-us-east-1.graphcms.com/v2/cl3mb4j4z213k01z1hpd023h0/master'
);

const QUERY = gql`
  {
    posts(orderBy: publishedAt_DESC) {
      id
      title
      datePublished
      slug
      content {
        html
      }
      author {
        name
        avatar {
          url
        }
        slug
      }
      coverPhoto {
        publishedAt
        createdBy {
          id
        }
        url
      }
    }
  }
`;

export async function getStaticProps() {
  const { posts } = await graphcms.request(QUERY);
  return {
    props: {
      posts
    },
    revalidate: 10
  };
}

export default function Home({ posts }) {
  return (
    <div className={styles.container}>
      <Header title={'NextJS Blog'} />
      <main className={styles.main}>
        {posts.map((post) => (
          <BlogCard {...post} key={post.id} />
        ))}
      </main>
    </div>
  );
}
