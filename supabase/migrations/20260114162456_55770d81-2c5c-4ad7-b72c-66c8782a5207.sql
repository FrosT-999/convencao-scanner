-- Create table for sindicatos (unions) by CNAE
CREATE TABLE public.sindicatos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    nome text NOT NULL,
    cnae_principal integer NOT NULL,
    cnaes_secundarios integer[] DEFAULT '{}',
    uf character varying(2) NOT NULL,
    municipios text[] DEFAULT '{}', -- Empty array means all municipalities in the state
    endereco text,
    telefone text,
    email text,
    website text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_sindicatos_cnae ON public.sindicatos(cnae_principal);
CREATE INDEX idx_sindicatos_uf ON public.sindicatos(uf);
CREATE INDEX idx_sindicatos_cnaes_secundarios ON public.sindicatos USING GIN(cnaes_secundarios);

-- Enable RLS
ALTER TABLE public.sindicatos ENABLE ROW LEVEL SECURITY;

-- Allow public read access (sindicatos are public information)
CREATE POLICY "Anyone can view sindicatos"
ON public.sindicatos
FOR SELECT
USING (true);

-- Only authenticated users can insert/update (for admin purposes later)
CREATE POLICY "Authenticated users can insert sindicatos"
ON public.sindicatos
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can update sindicatos"
ON public.sindicatos
FOR UPDATE
TO authenticated
USING (true);

-- Add trigger for updated_at
CREATE TRIGGER update_sindicatos_updated_at
BEFORE UPDATE ON public.sindicatos
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Insert initial seed data with common unions
INSERT INTO public.sindicatos (nome, cnae_principal, cnaes_secundarios, uf, municipios, endereco, telefone, email) VALUES
-- Comércio
('Sindicato dos Comerciários de São Paulo', 4711301, ARRAY[4711302, 4712100, 4713001], 'SP', ARRAY['São Paulo'], 'Rua Formosa, 99 - Centro, São Paulo/SP', '(11) 3224-3344', 'contato@comerciarios.org.br'),
('Sindicato dos Empregados no Comércio do Rio de Janeiro', 4711301, ARRAY[4711302, 4712100], 'RJ', ARRAY['Rio de Janeiro'], 'Av. Presidente Vargas, 502 - Centro, Rio de Janeiro/RJ', '(21) 2253-8383', 'contato@secrio.org.br'),

-- Tecnologia
('Sindicato dos Trabalhadores em Tecnologia da Informação de SP', 6201500, ARRAY[6202300, 6203100, 6204000, 6209100], 'SP', '{}', 'Av. Paulista, 1000 - Bela Vista, São Paulo/SP', '(11) 3251-1000', 'contato@sindpd.org.br'),
('Sindicato dos Trabalhadores em Processamento de Dados do RJ', 6201500, ARRAY[6202300, 6203100], 'RJ', '{}', 'Rua da Assembleia, 10 - Centro, Rio de Janeiro/RJ', '(21) 2531-5252', 'contato@sindpdrj.org.br'),

-- Construção Civil
('Sindicato dos Trabalhadores na Construção Civil de SP', 4120400, ARRAY[4121400, 4122500, 4211101], 'SP', '{}', 'Rua Marquês de Itu, 70 - Vila Buarque, São Paulo/SP', '(11) 3331-8000', 'contato@sintracon.org.br'),
('Sindicato dos Trabalhadores da Construção Civil do RJ', 4120400, ARRAY[4121400, 4122500], 'RJ', '{}', 'Rua Evaristo da Veiga, 55 - Centro, Rio de Janeiro/RJ', '(21) 2220-3535', 'contato@siticonrj.org.br'),

-- Alimentação
('Sindicato dos Trabalhadores em Hotéis e Restaurantes de SP', 5611201, ARRAY[5611202, 5611203, 5612100], 'SP', ARRAY['São Paulo'], 'Rua Aurora, 957 - Santa Ifigênia, São Paulo/SP', '(11) 3331-4422', 'contato@sinthoresp.org.br'),
('Sindicato dos Empregados em Bares e Restaurantes do RJ', 5611201, ARRAY[5611202, 5612100], 'RJ', ARRAY['Rio de Janeiro'], 'Rua do Senado, 230 - Centro, Rio de Janeiro/RJ', '(21) 2224-8585', 'contato@sindrio.org.br'),

-- Saúde
('Sindicato dos Trabalhadores em Estabelecimentos de Saúde de SP', 8610101, ARRAY[8610102, 8621601, 8621602], 'SP', '{}', 'Rua 24 de Maio, 104 - República, São Paulo/SP', '(11) 3331-5500', 'contato@sindsaudesp.org.br'),
('Sindicato dos Empregados em Hospitais do RJ', 8610101, ARRAY[8610102, 8621601], 'RJ', '{}', 'Av. Rio Branco, 277 - Centro, Rio de Janeiro/RJ', '(21) 2533-4040', 'contato@sindhospitaisrj.org.br'),

-- Educação
('Sindicato dos Professores de São Paulo', 8511200, ARRAY[8512100, 8513900, 8520100], 'SP', '{}', 'Rua Borges Lagoa, 208 - Vila Clementino, São Paulo/SP', '(11) 5080-5988', 'contato@sinprosp.org.br'),
('Sindicato dos Professores do Rio de Janeiro', 8511200, ARRAY[8512100, 8513900], 'RJ', '{}', 'Rua México, 11 - Centro, Rio de Janeiro/RJ', '(21) 2220-2022', 'contato@sinprorj.org.br'),

-- Metalurgia
('Sindicato dos Metalúrgicos de São Paulo', 2451200, ARRAY[2511000, 2512800, 2521700], 'SP', ARRAY['São Paulo'], 'Rua Galvão Bueno, 782 - Liberdade, São Paulo/SP', '(11) 3207-8400', 'contato@sindmetalsp.org.br'),
('Sindicato dos Metalúrgicos do ABC', 2451200, ARRAY[2511000, 2512800, 2521700, 2910701], 'SP', ARRAY['São Bernardo do Campo', 'Santo André', 'São Caetano do Sul', 'Diadema'], 'Rua João Basso, 231 - Centro, São Bernardo do Campo/SP', '(11) 4126-7474', 'contato@smabc.org.br'),

-- Transporte
('Sindicato dos Motoristas e Trabalhadores em Transporte de SP', 4921301, ARRAY[4921302, 4922101, 4922102], 'SP', '{}', 'Rua Riachuelo, 25 - Centro, São Paulo/SP', '(11) 3397-4500', 'contato@sintesp.org.br'),
('Sindicato dos Rodoviários do Rio de Janeiro', 4921301, ARRAY[4921302, 4922101], 'RJ', '{}', 'Praça Cristiano Ottoni, s/n - Central do Brasil, Rio de Janeiro/RJ', '(21) 2233-8500', 'contato@sindrodoviarios.org.br'),

-- Bancários
('Sindicato dos Bancários de São Paulo', 6422100, ARRAY[6423900, 6424701, 6424702], 'SP', '{}', 'Rua São Bento, 413 - Centro, São Paulo/SP', '(11) 3188-5200', 'contato@spbancarios.com.br'),
('Sindicato dos Bancários do Rio de Janeiro', 6422100, ARRAY[6423900, 6424701], 'RJ', '{}', 'Av. Rio Branco, 12 - Centro, Rio de Janeiro/RJ', '(21) 2103-4300', 'contato@seaborj.org.br');
