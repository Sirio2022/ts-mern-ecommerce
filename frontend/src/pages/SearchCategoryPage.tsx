import LoadingBox from '../components/LoadingBox'
import MessageBox from '../components/MessageBox'
import ProductItem from '../components/ProductItem'
import { Helmet } from 'react-helmet-async'
import { useGetSearchCategoryProductsQuery } from '../hooks/productHooks';
import { ApiError } from '../types/ApiError';
import { getError } from '../utils/Utils';
import { Col, Row } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';


export default function SearchCategoryPage() {

    const [query] = useSearchParams();

    const { data: categoryProducts, isLoading, error } = useGetSearchCategoryProductsQuery(query.get('category') || '');

    return (
        isLoading ? (
            <LoadingBox />
        ) : error ? (
            <MessageBox variant='danger'>{getError(error as ApiError)}</MessageBox>
        ) : (
            <Row>
                <Helmet>
                    <title>Music Store</title>
                    <meta
                        name='description'
                        content='We sell the best Guitars, Pianos, Drums and more at the best prices.'
                    />
                    <meta
                        name='keywords'
                        content='Electic guitars, accoustic guitars, pianos, drums, music, music store, buy instruments, buy music instruments, buy guitars, buy pianos, buy drums, buy music gear, music gear, music equipment, music accessories, music store, music shop, music instruments, music instruments store, music instruments shop, music instruments online, music instruments for sale, music instruments near me, music instruments online store, music instruments online shop, music instruments online sale, music instruments online near me, music instruments online for sale'
                    />
                </Helmet>


                {categoryProducts!.map((product) => (
                    <Col
                        key={product.slug}
                        sm={6}
                        md={4}
                        lg={3}
                    >
                        <ProductItem product={product} />
                    </Col>
                ))}

            </Row>
        )
    )
}