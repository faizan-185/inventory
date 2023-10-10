import { Alert, Col, Row } from "reactstrap";
import SalesChart from "../components/dashboard/SalesChart";
import Feeds from "../components/dashboard/Feeds";
import ProjectTables from "../components/dashboard/ProjectTable";

import Blog from "../components/dashboard/Blog";
import bg1 from "../assets/images/bg/bg1.jpg";
import bg2 from "../assets/images/bg/bg2.jpg";
import bg3 from "../assets/images/bg/bg3.jpg";
import bg4 from "../assets/images/bg/bg4.jpg";
import { useEffect, useState } from "react";
import Loader from "../layouts/loader/Loader";
import { getProductIndications } from "../api/pricing";

const BlogData = [
  {
    image: bg1,
    title: "This is simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg2,
    title: "Lets be simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg3,
    title: "Don't Lamp blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg4,
    title: "Simple is beautiful",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
];

const Starter = () => {
  const [deadProducts, setDeadProducts] = useState([])
  const [sellingProducts, setSellingProducts] = useState([])
  const [qtyIndicationProducts, setQtyIndcationProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [visible, setVisible] = useState(false)
  const [error, setError] = useState("")
  const [date, setDate] = useState(null)
  const token = localStorage.getItem("token")

  useEffect(() => {
    if(token) {
      getProductIndications({}).then(res => {
        if (res.status === 200) {
          setDeadProducts(res.data.deadProducts)
          setSellingProducts(res.data.sellingProducts)
          setQtyIndcationProducts(res.data.qtyIndication)
          setDate(res.data.date)
          setLoading(false)
        }
      }).catch(error => {
        setLoading(false)
        setVisible(true)
        setError(error?.response?.data)
        setTimeout(() => {
          setVisible(false);
        }, 5000);
      })
    }
  }, [token])

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');


    return `${day}/${month}/${year}`;
  };

  const onDismiss = () => {
    setVisible(false);
  };

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      {/***Top Cards***/}

      {/***Sales & Feed***/}
      <Alert color="danger" isOpen={visible} toggle={onDismiss.bind(null)}>
        An Error Occurred! {error}
      </Alert>
      <Row>
        <Col sm="6" lg="6" xl="7" xxl="8">
          <SalesChart />
        </Col>
        <Col sm="6" lg="6" xl="5" xxl="4" style={{ maxHeight: "80vh", boxShadow: "5px 5px 10px rgba(0, 0, 0, 0.2)", paddingTop: "20px", marginBottom: "20px", background: "#fff", overflow: "auto" }}>
          {typeof date === "string" ? <p><b>There are no dates for indications. To view indication set date from Indication Page or from Settings</b></p> :
            <div>
              <ProjectTables data={deadProducts}
                title='Dead Products Listing'
                subtitle={`Dead indicating products between ${formatDate(new Date(date?.startDate))} and ${formatDate(new Date(date?.endDate))}`} />

              <ProjectTables data={sellingProducts}
                title='Best Selling Products Listing'
                subtitle={`Best selling products between ${formatDate(new Date(date?.startDate))} and ${formatDate(new Date(date?.endDate))}`} />
              <ProjectTables data={qtyIndicationProducts}
                title='Products with ending Qty. Listing'
                subtitle={`Products with ending Qty. between ${formatDate(new Date(date?.startDate))} and ${formatDate(new Date(date?.endDate))}`} />
            </div>
          }
        </Col>
      </Row>
      {/***Table ***/}
      <Row>
        <Col lg="12">
          {/* {deadProducts?.length && <ProjectTables data={deadProducts} />} */}
        </Col>
      </Row>

    </div>
  );
};

export default Starter;
