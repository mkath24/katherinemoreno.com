import fs from "fs";
import matter from "gray-matter";
import type { NextPage } from "next";
import Head from "next/head";
import { Tech } from "../components/Tech/Tech";
import { AboutMe } from "../components/AboutMe/AboutMe";
import { Summary } from "../components/Summary/Summary";
import { NextSeo } from "next-seo";

export interface HomeProps {
  technologies: TechnologyI[];
  aboutMeList: AboutMeI[];
  summaryList: SummaryI[];
  seoList: SeoI[];
  socialList: SocialI[];
  techSectionList: TechSectionI[];
}

export interface TechnologyI {
  image: string;
  title: string;
  index: number;
  rating: number;
}

export interface AboutMeI {
  image: string;
  language: string;
  title: string;
  content: string;
}

export interface SummaryI {
  image: string;
  language: string;
  title: string;
  content: string;
}

export interface SeoI {
  title: string;
  description: string;
  ico: string;
  image: string;
  jsonLd: string;
}

export interface SocialI {
  title: string;
  url: string;
  index: number;
  image: string;
}

export interface TechSectionI {
  header: string;
  description: string;
  footer: string;
}

const Home: NextPage<HomeProps> = (props) => {
  return (
    <div className="container flex flex-col mx-auto">
      <NextSeo
        title={props.seoList[0].title}
        description={props.seoList[0].description}
        canonical="https://www.katherinemoreno.com/"
        openGraph={{
          locale: "es_ES",
          url: "https://www.katherinemoreno.com/",
          title: props.seoList[0].title,
          description: props.seoList[0].description,
          images: [
            {
              url: props.seoList[0].image,
              width: 800,
              height: 800,
              alt: "Katherine Moreno",
              type: "image/webp",
            },
          ],
          site_name: "Katherine Moreno",
        }}
        twitter={{
          handle: "@handle",
          site: "@site",
          cardType: "summary_large_image",
        }}
      />
      <Head>
        <link rel="icon" href={props.seoList[0].ico} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(props.seoList[0].jsonLd),
          }}
        />
      </Head>
      <main className="flex flex-col gap-10 p-4 sm:p-8 xl:pt-10 xl:px-64">
        <section>
          <AboutMe data={props.aboutMeList[1]} />
        </section>
        <hr />
        <section>
          <Summary data={props.summaryList[0]} />
        </section>
        <section>
          <ol className="flex flex-col gap-4">
            {props.technologies.map((tech) => {
              return (
                <li key={tech.index}>
                  <Tech data={tech} />
                </li>
              );
            })}
          </ol>
        </section>
      </main>
    </div>
  );
};

export async function getStaticProps() {
  const filesInTechnologies = fs.readdirSync("./content/technologies");
  const filesInAboutMe = fs.readdirSync("./content/about-me");
  const filesInSummary = fs.readdirSync("./content/summary");
  const filesInSocial = fs.readdirSync("./content/social");
  const filesInSeo = fs.readdirSync("./content/seo");
  const filesInTechSection = fs.readdirSync("./content/tech-section");

  const techSeoList = filesInSeo.map((filename) => {
    const file = fs.readFileSync(`./content/seo/${filename}`, "utf8");
    const matterData = matter(file);
    const data = {
      title: matterData.data.title,
      description: matterData.data.description,
      ico: matterData.data.ico,
      image: matterData.data.image,
      jsonLd: JSON.parse(matterData.data.jsonLd),
    };
    return data;
  });

  const techSocialList = filesInSocial
    .map((filename) => {
      const file = fs.readFileSync(`./content/social/${filename}`, "utf8");
      const matterData = matter(file);
      const data = {
        title: matterData.data.title,
        url: matterData.data.url,
        index: matterData.data.index,
        image: matterData.data.image,
      };
      return data;
    })
    .sort((a, b) => a.index - b.index);

  const techSectionList = filesInTechSection.map((filename) => {
    const file = fs.readFileSync(`./content/tech-section/${filename}`, "utf8");
    const matterData = matter(file);
    const data = {
      header: matterData.data.header,
      description: matterData.data.description,
      footer: matterData.data.footer,
    };
    return data;
  });

  const technologies = filesInTechnologies
    .map((filename) => {
      const file = fs.readFileSync(
        `./content/technologies/${filename}`,
        "utf8"
      );
      const matterData = matter(file);
      const data = {
        image: matterData.data.image,
        title: matterData.data.title,
        index: matterData.data.index,
        rating: matterData.data.rating,
      };
      return data;
    })
    .sort((a, b) => b.rating - a.rating);

  const aboutMe = filesInAboutMe.map((filename) => {
    const file = fs.readFileSync(`./content/about-me/${filename}`, "utf8");
    const matterData = matter(file);
    const data = {
      image: matterData.data.image,
      language: matterData.data.language,
      title: matterData.data.title,
      content: matterData.content,
    };
    return data;
  });

  const summary = filesInSummary.map((filename) => {
    const file = fs.readFileSync(`./content/summary/${filename}`, "utf8");
    const matterData = matter(file);
    const data = {
      image: matterData.data.image,
      language: matterData.data.language,
      title: matterData.data.title,
      content: matterData.content,
    };
    return data;
  });

  const homeProps: HomeProps = {
    technologies: technologies,
    aboutMeList: aboutMe,
    summaryList: summary,
    seoList: techSeoList,
    socialList: techSocialList,
    techSectionList: techSectionList,
  };

  return {
    props: homeProps,
  };
}

export default Home;
