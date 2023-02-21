import Head from "next/head";
import { MongoClient } from "mongodb";

import MeetupList from "../components/meetups/MeetupList";

function HomePage(props) {
  return (
    <>
      <Head>
        <title>Meetups Demo</title>
        <meta
          name="description"
          content="Browse these places where you can meetup"
        />
      </Head>
      <MeetupList meetups={props.meetups} />
    </>
  );
}

// //This code will execute on the server, never on the machines of your visitors!
// export async function getServerSideProps(context) {
//   const req = context.req;
//   const res = context.res;

//   return {
//     props: {
//       meetups: DUMMY_MEETUPS,
//     },
//   };
// }

//This code will never run on the machines of your visitors, this code is only executed during the build process, not on the server!
export async function getStaticProps() {
  const client = await MongoClient.connect(
    "mongodb+srv://milanmino:Slavko-1994@cluster0.s22mjyv.mongodb.net/meetups?retryWrites=true&w=majority"
  );
  const db = client.db();

  const meetupsCollection = db.collection("meetups");

  const meetupsMongo = await meetupsCollection.find().toArray();

  client.close();

  return {
    props: {
      meetups: meetupsMongo.map((meetup) => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString(),
      })),
    },
    revalidate: 1,
  };
}

export default HomePage;
