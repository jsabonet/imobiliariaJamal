# 🔴 PROBLEMA CRÍTICO DESCOBERTO: Multiplicação de Arquivos de Imagem

**Data:** 21 de Fevereiro de 2026  
**Severidade:** 🔴 **CRÍTICA** - Causa imediata de lentidão e consumo excessivo de disco  
**Impacto:** Espaço desperdiçado estimado em **60-80% do volume media**

---

## 📊 Resumo da Descoberta

Durante investigação de performance do servidor, foi identificado que o sistema está mantendo **múltiplas versões da mesma imagem** sem remover as antigas:

### Números Identificados:
- **Total de arquivos JPG:** 2,817 arquivos
- **Espaço usado:** 1.35GB em `/app/media/properties/`
- **Padrão descoberto:** 4-5 versões da mesma imagem base

### Exemplo Real:
```bash
/app/media/properties/1000653086.jpg                                    ← versão 1
/app/media/properties/1000653086_s1Cz5vU.jpg                           ← versão 2
/app/media/properties/1000653086_s1Cz5vU_rXqIunh.jpg                   ← versão 3
/app/media/properties/1000653086_s1Cz5vU_rXqIunh_UEJByuI.jpg          ← versão 4
/app/media/properties/1000653086_s1Cz5vU_rXqIunh_UEJByuI_27NPvj3.jpg ← versão 5
```

**Todas as 5 versões** ocupam espaço em disco, mas apenas a **última é referenciada** no banco de dados.

---

## 🔍 Causa Raiz

### Comportamento do Django com `upload_to`:

Quando configurado com sufixo aleatório para evitar colisão de nomes:

```python
class PropertyImage(models.Model):
    image = models.ImageField(upload_to='properties/')
    # Django gera: arquivo.jpg → arquivo_ABC123.jpg se já existir
```

### O que está acontecendo:

1. **Upload inicial:** `1000653086.jpg` (sem marca d'água)
2. **Aplicação de marca d'água (1ª vez):** 
   - Django salva como `1000653086_s1Cz5vU.jpg` (arquivo já existe, adiciona sufixo)
   - ❌ Arquivo original **NÃO é removido**
3. **Re-aplicação de marca d'água (2ª vez - teste/erro?):**
   - Django salva como `1000653086_s1Cz5vU_rXqIunh.jpg`
   - ❌ Versões anteriores **NÃO são removidas**
4. **Re-aplicação continuada:** Cada vez adiciona novo sufixo
5. **Resultado:** 5 versões ocupando 5x o espaço necessário

### Por que isso aconteceu:

1. **Restaurações múltiplas:** Histórico mostra múltiplas restaurações de imagens (17 Fev)
   - `RESTAURACAO_CONCLUIDA_17FEV2026.md`
   - `restore_images_from_backup.sh`
   - `PLANO_RESTAURACAO_CONTROLADA.md`

2. **Testes de marca d'água:** Aplicação e re-aplicação durante desenvolvimento
   - `MARCA_DAGUA_IMPLEMENTATION.md`
   - `ACOES_IMEDIATAS_REMOVER_MARCA_DAGUA.md`
   - `RESTAURAR_IMAGENS_SEM_MARCA_DAGUA.md`

3. **Falta de limpeza automática:** Django não remove versões antigas por padrão

---

## 💥 Impacto no Sistema

### 1. ⚠️ Performance
- **Listagens lentas:** Sistema precisa varrer 2,817 arquivos vs ~563 necessários
- **Backups lentos:** Backup de 1.4GB contém 80% de arquivos obsoletos
- **I/O desnecessário:** Disco lê/escreve 5x mais que necessário

### 2. 💾 Espaço em Disco
- **Atual:** 1.35GB usado
- **Necessário:** ~270-350MB (20-25% do atual)
- **Desperdício:** ~1GB (75-80% são duplicatas)
- **Impacto no servidor:** 72% de uso poderia ser 66% ou menos

### 3. 🐌 Operações Afetadas
- Upload de novas imagens (lento ao listar diretório)
- Página de listagem de propriedades (Django precisa verificar existência de arquivos)
- Backup/restore (processa 5x mais arquivos)
- Aplicação de marca d'água (I/O desnecessário)

---

## 🎯 Solução Proposta

### Fase 1: IDENTIFICAÇÃO ⚠️ (NÃO EXECUTAR AINDA)

Criar script para identificar arquivos órfãos com segurança:

```python
# Script: identify_orphan_images.py
from django.core.management.base import BaseCommand
from core.models import PropertyImage
import os
from pathlib import Path

class Command(BaseCommand):
    help = 'Identifica imagens órfãs no media/properties'

    def handle(self, *args, **options):
        media_root = Path('/app/media/properties')
        
        # 1. Obter todas as imagens referenciadas no banco
        db_images = set(
            PropertyImage.objects.values_list('image', flat=True)
        )
        
        # Normalizar caminhos
        db_images = {img.replace('properties/', '') for img in db_images}
        
        # 2. Obter todos os arquivos no disco
        disk_files = set()
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
            disk_files.update(
                f.name for f in media_root.glob(ext)
            )
        
        # 3. Encontrar órfãos
        orphans = disk_files - db_images
        
        # 4. Reportar
        total_size = 0
        orphan_list = []
        
        for orphan in sorted(orphans):
            file_path = media_root / orphan
            if file_path.exists():
                size = file_path.stat().st_size
                total_size += size
                orphan_list.append((orphan, size))
        
        # Output
        self.stdout.write(f"\n{'='*80}")
        self.stdout.write(f"ANÁLISE DE IMAGENS ÓRFÃS")
        self.stdout.write(f"{'='*80}\n")
        self.stdout.write(f"Total de imagens no banco: {len(db_images)}")
        self.stdout.write(f"Total de arquivos no disco: {len(disk_files)}")
        self.stdout.write(f"Total de órfãos: {len(orphans)}")
        self.stdout.write(f"Espaço desperdiçado: {total_size / 1024 / 1024:.2f} MB\n")
        
        # Salvar lista
        output_file = '/app/orphan_images.txt'
        with open(output_file, 'w') as f:
            f.write("# Imagens órfãs identificadas\n")
            f.write(f"# Total: {len(orphans)} arquivos\n")
            f.write(f"# Tamanho: {total_size / 1024 / 1024:.2f} MB\n\n")
            for name, size in orphan_list:
                f.write(f"{name}\t{size}\n")
        
        self.stdout.write(
            self.style.SUCCESS(
                f"\nLista salva em: {output_file}"
            )
        )
```

### Fase 2: VALIDAÇÃO ✅ (EXECUTAR PRIMEIRO)

**ANTES de remover qualquer arquivo:**

1. **Snapshot do servidor** (DigitalOcean)
2. **Backup do volume media:**
   ```bash
   docker exec jamalimobiliaria_backend_1 tar -czf /tmp/media_backup.tar.gz /app/media/properties
   docker cp jamalimobiliaria_backend_1:/tmp/media_backup.tar.gz ~/backup_pre_cleanup_$(date +%Y%m%d).tar.gz
   ```
3. **Testar site está funcionando** (imagens carregando corretamente)
4. **Executar script de identificação:**
   ```bash
   docker exec jamalimobiliaria_backend_1 python manage.py identify_orphan_images
   ```
5. **Revisar lista de órfãos** manualmente (amostragem)

### Fase 3: LIMPEZA 🧹 (EXECUTAR COM CUIDADO)

Criar script de limpeza SEGURO:

```python
# Script: cleanup_orphan_images.py
from django.core.management.base import BaseCommand
from core.models import PropertyImage
import os
from pathlib import Path

class Command(BaseCommand):
    help = 'Remove imagens órfãs APÓS validação'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Apenas simula, não remove nada'
        )
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirmação necessária para executar'
        )

    def handle(self, *args, **options):
        if not options['confirm'] and not options['dry_run']:
            self.stdout.write(
                self.style.ERROR(
                    'ERRO: Use --dry-run para testar ou --confirm para executar'
                )
            )
            return

        media_root = Path('/app/media/properties')
        
        # 1. Obter imagens do banco
        db_images = set(
            PropertyImage.objects.values_list('image', flat=True)
        )
        db_images = {img.replace('properties/', '') for img in db_images}
        
        # 2. Obter arquivos do disco
        disk_files = set()
        for ext in ['*.jpg', '*.jpeg', '*.png', '*.webp']:
            disk_files.update(f.name for f in media_root.glob(ext))
        
        # 3. Identificar órfãos
        orphans = disk_files - db_images
        
        # 4. Remover (ou simular)
        removed_count = 0
        removed_size = 0
        
        for orphan in sorted(orphans):
            file_path = media_root / orphan
            if file_path.exists():
                size = file_path.stat().st_size
                
                if options['dry_run']:
                    self.stdout.write(f"[DRY-RUN] Removeria: {orphan} ({size/1024:.2f} KB)")
                else:
                    file_path.unlink()
                    self.stdout.write(f"[REMOVIDO] {orphan} ({size/1024:.2f} KB)")
                
                removed_count += 1
                removed_size += size
        
        # 5. Resumo
        self.stdout.write(f"\n{'='*80}")
        if options['dry_run']:
            self.stdout.write(self.style.WARNING("[SIMULAÇÃO - NADA FOI REMOVIDO]"))
        self.stdout.write(f"Arquivos removidos: {removed_count}")
        self.stdout.write(f"Espaço liberado: {removed_size / 1024 / 1024:.2f} MB")
        self.stdout.write(f"{'='*80}\n")
```

### Fase 4: VALIDAÇÃO PÓS-LIMPEZA ✅

**APÓS a limpeza:**

1. **Testar site completamente:**
   - Página inicial (imagens de destaque)
   - Listagem de propriedades (todas as thumbnails)
   - Página de detalhe de propriedades (galeria completa)
   - Dashboard admin (listagem de imagens)

2. **Verificar logs de erro:**
   ```bash
   docker-compose logs backend | grep -i "not found\|404\|error"
   ```

3. **Verificar espaço liberado:**
   ```bash
   docker exec jamalimobiliaria_backend_1 du -sh /app/media/properties
   ```

4. **Se houver problemas:** Restaurar do backup
   ```bash
   docker cp backup_pre_cleanup_20260221.tar.gz jamalimobiliaria_backend_1:/tmp/
   docker exec jamalimobiliaria_backend_1 tar -xzf /tmp/backup_pre_cleanup_20260221.tar.gz -C /
   ```

---

## 🛡️ Prevenção Futura

### 1. Modificar Model para Auto-cleanup

```python
# Em backend/core/models.py

from django.db import models
from django.db.models.signals import pre_save, post_delete
from django.dispatch import receiver
import os

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='properties/')
    order = models.IntegerField(default=0)
    
    class Meta:
        ordering = ['order']

# Signal para remover arquivo antigo quando atualizar
@receiver(pre_save, sender=PropertyImage)
def delete_old_image_on_update(sender, instance, **kwargs):
    """Remove arquivo antigo quando imagem é atualizada"""
    if not instance.pk:
        return  # Novo objeto, nada para remover
    
    try:
        old_image = PropertyImage.objects.get(pk=instance.pk).image
        if old_image and old_image != instance.image:
            if os.path.isfile(old_image.path):
                os.remove(old_image.path)
    except PropertyImage.DoesNotExist:
        pass  # Objeto foi deletado, ignorar

# Signal para remover arquivo quando deletar registro
@receiver(post_delete, sender=PropertyImage)
def delete_image_on_record_delete(sender, instance, **kwargs):
    """Remove arquivo quando registro é deletado"""
    if instance.image:
        if os.path.isfile(instance.image.path):
            os.remove(instance.image.path)
```

### 2. Task Periódica de Limpeza

```python
# backend/core/management/commands/cleanup_media.py

from django.core.management.base import BaseCommand
from core.models import PropertyImage, Agent
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Limpa arquivos de mídia órfãos periodicamente'

    def handle(self, *args, **options):
        """
        Executar diariamente via cron:
        0 3 * * * docker exec jamalimobiliaria_backend_1 python manage.py cleanup_media
        """
        properties_dir = Path('/app/media/properties')
        agents_dir = Path('/app/media/agents')
        
        cleaned_files = 0
        cleaned_size = 0
        
        # Propriedades
        db_images = set(PropertyImage.objects.values_list('image', flat=True))
        db_images = {img.replace('properties/', '') for img in db_images}
        
        for file in properties_dir.glob('*.*'):
            if file.name not in db_images:
                size = file.stat().st_size
                file.unlink()
                cleaned_files += 1
                cleaned_size += size
                logger.info(f"Removed orphan: {file.name}")
        
        # Agentes (similar)
        # ...
        
        self.stdout.write(
            self.style.SUCCESS(
                f"Limpeza concluída: {cleaned_files} arquivos, "
                f"{cleaned_size / 1024 / 1024:.2f} MB liberados"
            )
        )
```

### 3. Configurar Cron Job

```bash
# No servidor de produção, adicionar ao crontab:
0 3 * * * docker exec jamalimobiliaria_backend_1 python manage.py cleanup_media >> /var/log/media_cleanup.log 2>&1
```

---

## 📊 Ganho Esperado

### Espaço em Disco:
- **Antes:** 1.35GB (2,817 arquivos)
- **Depois (estimado):** 270-350MB (~563 arquivos)
- **Liberado:** ~1GB (70-75% de redução)

### Performance:
- **Listagens:** 5x mais rápidas (menos arquivos para processar)
- **Backups:** 70% mais rápidos
- **I/O geral:** Redução de 75% nas operações de disco relacionadas a media

### Uso Total do Servidor:
- **Disco antes:** 72% (49GB/67GB)
- **Disco depois:** 70% (48GB/67GB)
- **Combinado com outras limpezas:** Pode chegar a 65%

---

## ⚠️ AVISOS CRÍTICOS

### ❌ NÃO FAÇA:
1. ❌ Remover arquivos manualmente sem identificar quais estão no banco
2. ❌ Deletar arquivos baseado apenas em data de modificação
3. ❌ Limpar SEM fazer backup primeiro
4. ❌ Executar limpeza sem testar com --dry-run

### ✅ FAÇA:
1. ✅ Snapshot do droplet ANTES de começar
2. ✅ Backup do volume media
3. ✅ Executar script de identificação primeiro
4. ✅ Revisar manualmente amostra dos arquivos a remover
5. ✅ Testar com --dry-run
6. ✅ Testar site APÓS cada etapa

---

## 🎯 Plano de Execução Recomendado

### Quando Executar:
- **Melhor horário:** Madrugada (2-4 AM) quando há menos tráfego
- **Dia:** Meio de semana (terça ou quarta)
- **Duração estimada:** 30-60 minutos

### Checklist:

#### ANTES:
- [ ] Avisar stakeholders sobre manutenção
- [ ] Snapshot do droplet DigitalOcean
- [ ] Backup do volume media (tar.gz)
- [ ] Testar que site está funcionando 100%
- [ ] Documentar estado atual (screenshots)

#### DURANTE:
- [ ] Colocar site em modo manutenção (opcional)
- [ ] Executar script identify_orphan_images.py
- [ ] Revisar lista de órfãos (amostragem manual)
- [ ] Executar cleanup com --dry-run
- [ ] Analisar output do dry-run
- [ ] Executar cleanup com --confirm
- [ ] Verificar espaço liberado

#### DEPOIS:
- [ ] Testar site completamente (todas as páginas)
- [ ] Verificar logs de erro
- [ ] Documentar resultados
- [ ] Monitorar por 24-48h
- [ ] Se OK: implementar prevenção futura
- [ ] Remover backup temporário após 7 dias

---

## 📞 Contato

**Responsável Técnico:** Sistema de Análise Automática  
**Data da Descoberta:** 21 de Fevereiro de 2026  
**Prioridade:** 🔴 ALTA - Ação recomendada dentro de 7 dias  
**Risco se não corrigir:** Continua consumindo espaço, backups cada vez maiores, performance degrada

---

## 🔗 Documentos Relacionados

- [ANALISE_PERFORMANCE_SERVIDOR.md](ANALISE_PERFORMANCE_SERVIDOR.md) - Análise geral do servidor
- [ANALISE_RECURSOS_UTILIZADOS.md](ANALISE_RECURSOS_UTILIZADOS.md) - O que pode ser removido
- [RESTAURACAO_CONCLUIDA_17FEV2026.md](RESTAURACAO_CONCLUIDA_17FEV2026.md) - Contexto das restaurações
- [MARCA_DAGUA_IMPLEMENTATION.md](MARCA_DAGUA_IMPLEMENTATION.md) - Implementação do sistema de marca d'água
