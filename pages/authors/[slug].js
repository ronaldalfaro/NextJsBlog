import Header from '../../components/Header';
import AuthorCard from '../../components/AuthorCard';
import styles from '../../styles/Author.module.css';
import { GraphQLClient, gql } from 'graphql-request';
import AuthorTitle from '../../components/AuthorTitle';

const graphcms = new GraphQLClient(
  'https://api-us-east-1.graphcms.com/v2/cl3mb4j4z213k01z1hpd023h0/master'
);

const QUERY = gql`
  query Author($slug: String!) {
    author(where: { slug: $slug }) {
      id
      name
      avatar {
        url
      }
      posts {
        id
        title
        author {
          name
          avatar {
            url
          }
          slug
        }
        coverPhoto {
          id
          url
        }
        datePublished
        slug
      }
    }
  }
`;

const SLUGLIST = gql`
  {
    authors {
      slug
    }
  }
`;

export async function getStaticPaths() {
  const { authors } = await graphcms.request(SLUGLIST);
  return {
    paths: authors.map((author) => ({ params: { slug: author.slug } })),
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const slug = params.slug;
  const data = await graphcms.request(QUERY, { slug });
  const author = data.author;
  return {
    props: {
      author
    },
    revalidate: 10
  };
}

export default function Author({ author }) {
  return (
    <>
      <Header title={'NextJS Blog'} />
      <AuthorTitle name={author.name} avatar={author.avatar.url} />
      <main className={styles.main}>
        {author.posts.map((post) => (
          <AuthorCard {...post} key={post.id} />
        ))}
      </main>
    </>
  );
}
