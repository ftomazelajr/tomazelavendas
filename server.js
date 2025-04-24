const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const INFINITY_TOKEN = process.env.INFINITY_TOKEN;

app.post('/criar-pagamento', async (req, res) => {
  const { valor, descricao } = req.body;

  try {
    const response = await axios.post(
      'https://api.infinitypay.io/api/v1/checkout',
      {
        amount: parseFloat(valor),
        description: descricao,
        payment_type: 'CREDIT_CARD',
        installments: 1
      },
      {
        headers: {
          Authorization: `Bearer ${INFINITY_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({ link: response.data.checkout_url });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: 'Erro ao criar pagamento' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
