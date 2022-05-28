/* eslint-disable @next/next/no-img-element */
import Header from '../../components/Header';
import styles from '../../styles/Slug.module.css';
import { GraphQLClient, gql } from 'graphql-request';
import Link from 'next/link';

const graphcms = new GraphQLClient(
  'https://api-us-east-1.graphcms.com/v2/cl3mb4j4z213k01z1hpd023h0/master'
);

const QUERY = gql`
  query Post($slug: String!) {
    post(where: { slug: $slug }) {
      id
      title
      slug
      datePublished
      author {
        id
        name
        avatar {
          url
        }
        slug
      }
      content {
        html
      }
      coverPhoto {
        id
        url
      }
    }
  }
`;

const SLUGLIST = gql`
  {
    posts {
      slug
    }
  }
`;

export async function getStaticPaths() {
  const { posts } = await graphcms.request(SLUGLIST);
  return {
    paths: posts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const slug = params.slug;
  const data = await graphcms.request(QUERY, { slug });
  const post = data.post;
  return {
    props: {
      post
    },
    revalidate: 10
  };
}

export default function BlogPost({ post }) {
  return (
    <>
      <Header title={'NextJS Blog'} />
      <main className={styles.blog}>
        <div className={styles.card}>
          <div className={styles.imgContainer}>
            <img src={post.coverPhoto.url} alt="cover photo" />
          </div>
          <div className={styles.text}>
            <h2>{post.title}</h2>
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: post.content.html }}
            ></div>
            <div className={styles.details}>
              <Link href={'/authors/' + post.author.slug}>
                <div className={styles.author}>
                  <img src={post.author.avatar.url} alt="author avatar" />
                  <h3>{post.author.name}</h3>
                </div>
              </Link>
              <div className={styles.date}>
                <h3>{post.datePublished}</h3>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
