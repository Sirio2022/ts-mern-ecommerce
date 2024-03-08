
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { formatoMoneda, getError } from '../utils/Utils';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js';
import { useOrderSummaryQuery } from '../hooks/orderHooks';
import Spinner from '../components/Spinner';
import { ApiError } from '../types/ApiError';
import MessageBox from '../components/MessageBox';
import { Link } from 'react-router-dom';
import { Col, Row } from 'react-bootstrap';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement
);

export const options = {
  resposive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Sales Report',
    },
  },
};

export default function DashboardPage() {


  const { data: summary, isLoading, error } = useOrderSummaryQuery();

  if (isLoading) return <Spinner />

  if (error) (
    <MessageBox variant='danger'>{getError(error as ApiError)}</MessageBox>
  )

  if (!summary) return <Spinner />

  const salesData = {
    labels: summary.salesData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        fill: true,
        label: 'Sales',
        data: summary.salesData.map((x: { totalSales: number }) => x.totalSales),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      }
    ]
  };

  const ordersData = {
    labels: summary.salesData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        fill: true,
        label: 'Orders',
        data: summary.salesData.map((x: { totalOrders: number }) => x.totalOrders),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      }
    ]
  };

  const productsData = {
    labels: summary.productsData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        fill: true,
        label: 'Products',
        data: summary.productsData.map((x: { totalProducts: number }) => x.totalProducts),
        borderColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153,102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],

        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(153,102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
      }
    ]
  };

  const usersData = {
    labels: summary.userData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        fill: true,
        label: 'Users',
        data: summary.userData.map((x: { totalUsers: number }) => x.totalUsers),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      }
    ]
  };

  const { pathname } = window.location;

  return (
    <Row>
      <Col md={2}>
        <Link
          to="/dashboard"
          className={
            pathname === '/dashboard'
              ? 'btn btn-dark my-1 w-100 text-start active'
              : 'btn btn-dark my-1 w-100 text-start'
          }
        >Dashboard</Link>
        <Link
          to="/adminorders"
          className={
            pathname === '/adminorders'
              ? 'btn btn-dark my-1 w-100 text-start active'
              : 'btn btn-dark my-1 w-100 text-start'
          }
        >Orders</Link>
        <Link
          to="/adminproducts"
          className={
            pathname === '/adminproducts'
              ? 'btn btn-dark my-1 w-100 text-start active'
              : 'btn btn-dark my-1 w-100 text-start'
          }
        >Products</Link>
        <Link
          to="/adminusers"
          className={
            pathname === '/adminusers'
              ? 'btn btn-dark my-1 w-100 text-start active'
              : 'btn btn-dark my-1 w-100 text-start'
          }
        >Users</Link>
      </Col>

      <Col md={10}>
        <div className="my-1 container-xl">
          <div className="row">
            <div className="col-md-3 mb-3">
              <div className="card">
                <div className="card-body">
                  <h4 className='text-primary'>Total Sales</h4>
                  <h3 className='dashboard-data'>{formatoMoneda(summary.ordersPrice)}</h3>
                  <Link to="/orderhistory">View Details</Link>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card">
                <div className="card-body">
                  <h4 className='text-primary'>Total Orders</h4>
                  <h3 className='dashboard-data'>{summary.ordersCount}</h3>
                  <Link to="/orderhistory">View Details</Link>
                </div>
              </div>
            </div>

            <div className="col-md-3 mb-3">
              <div className="card">
                <div className="card-body">
                  <h4 className='text-primary'>Total Users</h4>
                  <h3 className='dashboard-data'>{summary.usersCount}</h3>
                  <Link to="/userlist">View Details</Link>
                </div>
              </div>
            </div>

            <div className="col-md-3">
              <div className="card">
                <div className="card-body">
                  <h4 className='text-primary'>Total Products</h4>
                  <h3 className='dashboard-data'>{summary.productsCount}</h3>
                  <Link to="/productlist">View Details</Link>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="container pb-5">
          <div className="row">
            <div className="col-md-6">
              <h2 className='text-xl'>
                Sales Report
              </h2>
              <Line data={salesData} />
            </div>

            <div className="col-md-6">
              <h2 className='text-xl'>
                Orders Report
              </h2>
              <Line data={ordersData} />
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">


            <div className="col-md-6 ">
              <h2 className='text-xl'>
                Users Report
              </h2>
              <Bar data={usersData} />
            </div>
            <div className="col-md-6">
              <h2 className='text-xl'>
                Products Categories
              </h2>
              <Doughnut data={productsData} className='d-flex justify-content-center h-75 w-auto' />
            </div>
          </div>
        </div>
      </Col>
    </Row>
  )
}
