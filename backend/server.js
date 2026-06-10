import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';

const app = express();
app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

app.get('/api/reporte-ventas', async (req, res) => {
    try {
        await client.connect();
        
        const database = client.db("hardware_dashboard");
        const ventas = database.collection("ventas");

        const pipeline = [
            {
                '$match': {
                    'precio': { '$gt': 0 }
                }
            }, {
                '$project': {
                    'categoria': 1, 
                    'cantidad': 1, 
                    'recaudacionVenta': {
                        '$multiply': ['$precio', '$cantidad']
                    }
                }
            }, {
                '$group': {
                    '_id': '$categoria', 
                    'totalRecaudado': { '$sum': '$recaudacionVenta' }, 
                    'cantidadItems': { '$sum': '$cantidad' }, 
                    'ventaPromedio': { '$avg': '$recaudacionVenta' }
                }
            }, {
                '$match': {
                    'totalRecaudado': { '$gt': 315 }
                }
            }, {
                '$sort': {
                    'totalRecaudado': -1
                }
            }
        ];

        const reporte = await ventas.aggregate(pipeline).toArray();
        res.status(200).json(reporte);
        
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Error interno" });
    } finally {
        await client.close();
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});