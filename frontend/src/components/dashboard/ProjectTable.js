import { Card, CardBody, CardTitle, CardSubtitle, Table } from "reactstrap";
import user1 from "../../assets/images/users/user1.jpg";
import user2 from "../../assets/images/users/user2.jpg";
import user3 from "../../assets/images/users/user3.jpg";
import user4 from "../../assets/images/users/user4.jpg";
import user5 from "../../assets/images/users/user5.jpg";

const tableData = [
  {
    avatar: user1,
    name: "Hanna Gover",
    email: "hgover@gmail.com",
    project: "Flexy React",
    status: "pending",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: user2,
    name: "Hanna Gover",
    email: "hgover@gmail.com",
    project: "Lading pro React",
    status: "done",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: user3,
    name: "Hanna Gover",
    email: "hgover@gmail.com",
    project: "Elite React",
    status: "holt",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: user4,
    name: "Hanna Gover",
    email: "hgover@gmail.com",
    project: "Flexy React",
    status: "pending",
    weeks: "35",
    budget: "95K",
  },
  {
    avatar: user5,
    name: "Hanna Gover",
    email: "hgover@gmail.com",
    project: "Ample React",
    status: "done",
    weeks: "35",
    budget: "95K",
  },
];

const ProjectTables = ({ data, title, subtitle }) => {

  return (
    <div key={data.length ? data[0].id : "listing products"}>
      {data.length ? <Card>
        <CardBody>
          <CardTitle tag="h5">{title}</CardTitle>
          <CardSubtitle className="mb-2 text-muted" tag="h6">
            {subtitle}
          </CardSubtitle>

          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>Name</th>
                <th>Remain Qty.</th>

                <th>Sold Qty.</th>
              </tr>
            </thead>
            <tbody>
              {data.map((tdata, index) => (
                <tr key={index} className="border-top">
                  <td>
                    <div className="ms-1">
                      <h6 className="mb-0">{tdata.name}</h6>
                    </div>
                  </td>
                  <td>
                    <div className="ms-3">
                      {tdata.qty}
                    </div>
                  </td>
                  <td>{title.includes("ending Qty.") ? `sold ${tdata.qty} out of ${tdata.total}` : tdata.sold_qty}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card> :
        <div className="mb-5"><h3 className="mb-2">{title}</h3>
          <p>
            There are no {subtitle}
          </p>
        </div>
      }
    </div>
  );
};

export default ProjectTables;
