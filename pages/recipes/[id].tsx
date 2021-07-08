import Layout from "../../components/layout";
import { getAllPostIds, getPostData, RecipeData } from "../../lib/posts";
import Head from "next/head";
import Date from "../../components/date";
import utilStyles from "../../styles/utils.module.css";
import { GetStaticProps, GetStaticPaths } from "next";
import styles from "./[id].module.css";

export default function Post({ postData }: { postData: RecipeData }) {
  console.log(postData);
  return (
    <Layout>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <article>
        <h1 className={utilStyles.headingXl}>{postData.title}</h1>
        <div className={utilStyles.lightText}>
          <Date dateString={postData.date} />
        </div>

        <table className={styles.ingredients}>
          {postData.ingredients.map((ingr) => (
            <tr>
              <td className={styles.quantity}>
                <input type="text" value={`${ingr.quantity} ${ingr.unit}`} />
              </td>{" "}
              <td className={styles.name}>{ingr.data.title}</td>
            </tr>
          ))}
        </table>

        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const postData = await getPostData(params.id as string);
  return {
    props: {
      postData,
    },
  };
};
